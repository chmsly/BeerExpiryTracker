package com.beerexpirytracker.service;

import com.beerexpirytracker.model.Beer;
import com.beerexpirytracker.model.User;
import com.beerexpirytracker.repository.BeerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class NotificationService {
    
    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);
    
    @Autowired
    private BeerRepository beerRepository;
    
    @Autowired
    private JavaMailSender emailSender;
    
    @Value("${push.notification.enabled}")
    private boolean pushNotificationEnabled;
    
    @Value("${push.notification.api-key}")
    private String firebaseApiKey;
    
    private final HttpClient httpClient = HttpClient.newHttpClient();
    
    // Run daily at 9:00 AM
    @Scheduled(cron = "0 0 9 * * ?")
    @Transactional
    public void checkBeersAndSendReminders() {
        logger.info("Running scheduled reminder check");
        
        LocalDate today = LocalDate.now();
        
        // Skip weekends if needed
        if (isWeekend(today)) {
            logger.info("Today is a weekend, skipping reminders");
            return;
        }
        
        List<Beer> beersNeedingReminders = beerRepository.findBeersNeedingReminders(today);
        logger.info("Found {} beers needing reminders", beersNeedingReminders.size());
        
        for (Beer beer : beersNeedingReminders) {
            User user = beer.getUser();
            
            // Only send a max of 5 reminders per beer
            if (beer.getReminderCount() < 5) {
                boolean notificationSent = false;
                
                // Try push notification first
                if (pushNotificationEnabled && user.getDeviceToken() != null && !user.getDeviceToken().isEmpty()) {
                    notificationSent = sendPushNotification(beer, user);
                }
                
                // Fall back to email if push notification fails or is disabled
                if (!notificationSent && user.getEmail() != null && !user.getEmail().isEmpty()) {
                    sendEmailNotification(beer, user);
                    notificationSent = true;
                }
                
                if (notificationSent) {
                    beer.setReminderSent(true);
                    beer.setReminderCount(beer.getReminderCount() + 1);
                    beerRepository.save(beer);
                    logger.info("Sent reminder for beer: {} (count: {})", beer.getProductName(), beer.getReminderCount());
                }
            }
        }
    }
    
    private boolean sendPushNotification(Beer beer, User user) {
        try {
            String deviceToken = user.getDeviceToken();
            String title = "Beer Expiry Alert";
            String body = formatReminderMessage(beer);
            
            String jsonPayload = String.format(
                    "{"
                    + "\"to\":\"%s\","
                    + "\"notification\":{"
                    + "\"title\":\"%s\","
                    + "\"body\":\"%s\","
                    + "\"sound\":\"default\""
                    + "},"
                    + "\"data\":{"
                    + "\"beerId\":\"%s\","
                    + "\"click_action\":\"FLUTTER_NOTIFICATION_CLICK\""
                    + "}"
                    + "}",
                    deviceToken, title, body, beer.getId());
            
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://fcm.googleapis.com/fcm/send"))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "key=" + firebaseApiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();
            
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            
            boolean success = response.statusCode() == 200;
            if (!success) {
                logger.error("Failed to send push notification. Status: {}, Response: {}", 
                        response.statusCode(), response.body());
            }
            
            return success;
        } catch (IOException | InterruptedException e) {
            logger.error("Error sending push notification", e);
            return false;
        }
    }
    
    private void sendEmailNotification(Beer beer, User user) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("Beer Expiry Reminder");
            message.setText(formatReminderMessage(beer));
            
            emailSender.send(message);
            logger.info("Email notification sent to: {}", user.getEmail());
        } catch (Exception e) {
            logger.error("Failed to send email notification", e);
        }
    }
    
    private String formatReminderMessage(Beer beer) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM d, yyyy");
        return String.format("Reminder: %s %s will expire on %s (in %d days). Please check your inventory.",
                beer.getBrandName(), beer.getProductName(),
                beer.getExpiryDate().format(formatter),
                LocalDate.now().until(beer.getExpiryDate()).getDays());
    }
    
    private boolean isWeekend(LocalDate date) {
        DayOfWeek day = date.getDayOfWeek();
        return day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY;
    }
} 