'use client';

import { supabase } from '@/lib/supabase';
import { Tables } from '@/lib/supabase';

export interface BeerDTO {
  id: string;
  brandName: string;
  productName: string;
  type: string | null;
  expiryDate: string;
  imageUrl: string | null;
}

export interface BeerCreateRequest {
  brandName: string;
  productName: string;
  type?: string;
  expiryDate: string;
  image?: File | null;
}

export interface BeerUpdateRequest {
  id: string;
  brandName: string;
  productName: string;
  type?: string;
  expiryDate: string;
  image?: File | null;
}

export interface ExpiryTimelineStats {
  expiryBreakdown: {
    expired: number;
    within30Days: number;
    within90Days: number;
    after90Days: number;
  };
  monthlyExpiry: Record<string, number>;
}

export interface StatsSummary {
  totalBeers: number;
  expiredBeers: number;
  expiringSoon: number;
  avgDaysUntilExpiry: number;
  topBeerTypes: Array<{type: string, count: number}>;
}

function mapToBeerDTO(beer: Tables['beers']): BeerDTO {
  return {
    id: beer.id,
    brandName: beer.brand_name,
    productName: beer.product_name,
    type: beer.type,
    expiryDate: beer.expiry_date,
    imageUrl: beer.image_url
  };
}

class BeerService {
  async getAll(): Promise<BeerDTO[]> {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session?.user.id) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('beers')
      .select('*')
      .eq('user_id', sessionData.session.user.id);

    if (error) throw error;
    return (data || []).map(mapToBeerDTO);
  }

  async getById(id: string): Promise<BeerDTO> {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session?.user.id) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('beers')
      .select('*')
      .eq('id', id)
      .eq('user_id', sessionData.session.user.id)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Beer not found');
    
    return mapToBeerDTO(data);
  }

  async create(beer: BeerCreateRequest): Promise<BeerDTO> {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session?.user.id) {
      throw new Error('User not authenticated');
    }

    // Calculate reminder date (45 days before expiry)
    const expiryDate = new Date(beer.expiryDate);
    const reminderDate = new Date(expiryDate);
    reminderDate.setDate(reminderDate.getDate() - 45);

    // First, upload the image if provided
    let imageUrl = null;
    if (beer.image) {
      const fileName = `${Date.now()}_${beer.image.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('beer-images')
        .upload(`${sessionData.session.user.id}/${fileName}`, beer.image);

      if (uploadError) throw uploadError;
      
      // Get public URL for the uploaded image
      const { data: urlData } = supabase.storage
        .from('beer-images')
        .getPublicUrl(`${sessionData.session.user.id}/${fileName}`);
      
      imageUrl = urlData.publicUrl;
    }

    // Then, insert the beer record
    const { data, error } = await supabase
      .from('beers')
      .insert([
        {
          user_id: sessionData.session.user.id,
          brand_name: beer.brandName,
          product_name: beer.productName,
          type: beer.type || null,
          expiry_date: beer.expiryDate,
          reminder_date: reminderDate.toISOString().split('T')[0],
          image_url: imageUrl,
          reminder_sent: false,
          reminder_count: 0
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return mapToBeerDTO(data);
  }

  async update(beer: BeerUpdateRequest): Promise<BeerDTO> {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session?.user.id) {
      throw new Error('User not authenticated');
    }

    // Calculate reminder date (45 days before expiry)
    const expiryDate = new Date(beer.expiryDate);
    const reminderDate = new Date(expiryDate);
    reminderDate.setDate(reminderDate.getDate() - 45);

    // Check if the beer exists and belongs to the user
    const { data: existingBeer, error: fetchError } = await supabase
      .from('beers')
      .select('*')
      .eq('id', beer.id)
      .eq('user_id', sessionData.session.user.id)
      .single();

    if (fetchError) throw fetchError;
    if (!existingBeer) throw new Error('Beer not found or access denied');

    // Upload the image if provided
    let imageUrl = existingBeer.image_url;
    if (beer.image) {
      const fileName = `${Date.now()}_${beer.image.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('beer-images')
        .upload(`${sessionData.session.user.id}/${fileName}`, beer.image);

      if (uploadError) throw uploadError;
      
      // Get public URL for the uploaded image
      const { data: urlData } = supabase.storage
        .from('beer-images')
        .getPublicUrl(`${sessionData.session.user.id}/${fileName}`);
      
      imageUrl = urlData.publicUrl;
    }

    // Update the beer record
    const { data, error } = await supabase
      .from('beers')
      .update({
        brand_name: beer.brandName,
        product_name: beer.productName,
        type: beer.type || null,
        expiry_date: beer.expiryDate,
        reminder_date: reminderDate.toISOString().split('T')[0],
        image_url: imageUrl
      })
      .eq('id', beer.id)
      .eq('user_id', sessionData.session.user.id)
      .select()
      .single();

    if (error) throw error;
    return mapToBeerDTO(data);
  }

  async delete(id: string): Promise<void> {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session?.user.id) {
      throw new Error('User not authenticated');
    }

    // Get the beer to check if there's an image to delete
    const { data: beer, error: fetchError } = await supabase
      .from('beers')
      .select('image_url')
      .eq('id', id)
      .eq('user_id', sessionData.session.user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

    // Delete the beer record
    const { error } = await supabase
      .from('beers')
      .delete()
      .eq('id', id)
      .eq('user_id', sessionData.session.user.id);

    if (error) throw error;

    // Delete the image if it exists
    if (beer?.image_url) {
      const imagePath = beer.image_url.split('/').slice(-2).join('/'); // Extract the path from the URL
      const { error: storageError } = await supabase.storage
        .from('beer-images')
        .remove([imagePath]);
      
      if (storageError) console.error('Failed to delete image:', storageError);
    }
  }

  async search(query: string): Promise<BeerDTO[]> {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session?.user.id) {
      throw new Error('User not authenticated');
    }

    // Basic text search using ilike
    const { data, error } = await supabase
      .from('beers')
      .select('*')
      .eq('user_id', sessionData.session.user.id)
      .or(`brand_name.ilike.%${query}%,product_name.ilike.%${query}%,type.ilike.%${query}%`);

    if (error) throw error;
    return (data || []).map(mapToBeerDTO);
  }

  async getExpiringSoon(days: number = 7): Promise<BeerDTO[]> {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session?.user.id) {
      throw new Error('User not authenticated');
    }

    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    const { data, error } = await supabase
      .from('beers')
      .select('*')
      .eq('user_id', sessionData.session.user.id)
      .gte('expiry_date', today.toISOString().split('T')[0])
      .lte('expiry_date', futureDate.toISOString().split('T')[0])
      .order('expiry_date', { ascending: true });

    if (error) throw error;
    return (data || []).map(mapToBeerDTO);
  }

  async getExpiryTimelineStats(): Promise<ExpiryTimelineStats> {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session?.user.id) {
      throw new Error('User not authenticated');
    }

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Get all beers for the current user
    const { data: beers, error } = await supabase
      .from('beers')
      .select('*')
      .eq('user_id', sessionData.session.user.id);

    if (error) throw error;

    // Process the data to generate statistics
    const expired = beers.filter(beer => beer.expiry_date < todayStr).length;
    
    const in30Days = new Date();
    in30Days.setDate(today.getDate() + 30);
    const in30DaysStr = in30Days.toISOString().split('T')[0];
    
    const in90Days = new Date();
    in90Days.setDate(today.getDate() + 90);
    const in90DaysStr = in90Days.toISOString().split('T')[0];
    
    const within30Days = beers.filter(beer => 
      beer.expiry_date >= todayStr && beer.expiry_date <= in30DaysStr
    ).length;
    
    const within90Days = beers.filter(beer => 
      beer.expiry_date > in30DaysStr && beer.expiry_date <= in90DaysStr
    ).length;
    
    const after90Days = beers.filter(beer => beer.expiry_date > in90DaysStr).length;

    // Calculate monthly expiry for the next 6 months
    const monthlyExpiry: Record<string, number> = {};
    for (let i = 0; i < 6; i++) {
      const monthStart = new Date(today);
      monthStart.setMonth(monthStart.getMonth() + i);
      monthStart.setDate(1);
      
      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      monthEnd.setDate(0); // Last day of month
      
      const monthStartStr = monthStart.toISOString().split('T')[0];
      const monthEndStr = monthEnd.toISOString().split('T')[0];
      
      const key = `${monthStart.getFullYear()}-${monthStart.getMonth() + 1}`;
      monthlyExpiry[key] = beers.filter(beer => 
        beer.expiry_date >= monthStartStr && beer.expiry_date <= monthEndStr
      ).length;
    }

    return {
      expiryBreakdown: {
        expired,
        within30Days,
        within90Days,
        after90Days
      },
      monthlyExpiry
    };
  }

  async getTypeDistribution(): Promise<Record<string, number>> {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session?.user.id) {
      throw new Error('User not authenticated');
    }

    const { data: beers, error } = await supabase
      .from('beers')
      .select('type')
      .eq('user_id', sessionData.session.user.id);

    if (error) throw error;

    const typeDistribution: Record<string, number> = {};
    beers.forEach(beer => {
      const type = beer.type || 'Unknown';
      typeDistribution[type] = (typeDistribution[type] || 0) + 1;
    });

    return typeDistribution;
  }

  async getBrandDistribution(): Promise<Record<string, number>> {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session?.user.id) {
      throw new Error('User not authenticated');
    }

    const { data: beers, error } = await supabase
      .from('beers')
      .select('brand_name')
      .eq('user_id', sessionData.session.user.id);

    if (error) throw error;

    const brandDistribution: Record<string, number> = {};
    beers.forEach(beer => {
      brandDistribution[beer.brand_name] = (brandDistribution[beer.brand_name] || 0) + 1;
    });

    // Limit to top 10 brands
    const sortedBrands = Object.entries(brandDistribution)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return Object.fromEntries(sortedBrands);
  }

  async getStatsSummary(): Promise<StatsSummary> {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session?.user.id) {
      throw new Error('User not authenticated');
    }

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const in30Days = new Date();
    in30Days.setDate(today.getDate() + 30);
    const in30DaysStr = in30Days.toISOString().split('T')[0];

    // Get all beers for the current user
    const { data: beers, error } = await supabase
      .from('beers')
      .select('*')
      .eq('user_id', sessionData.session.user.id);

    if (error) throw error;

    const totalBeers = beers.length;
    const expiredBeers = beers.filter(beer => beer.expiry_date < todayStr).length;
    const expiringSoon = beers.filter(beer => 
      beer.expiry_date >= todayStr && beer.expiry_date <= in30DaysStr
    ).length;

    // Calculate average days until expiry for non-expired beers
    let avgDaysUntilExpiry = 0;
    const nonExpiredBeers = beers.filter(beer => beer.expiry_date >= todayStr);
    
    if (nonExpiredBeers.length > 0) {
      const totalDays = nonExpiredBeers.reduce((sum, beer) => {
        const expiryDate = new Date(beer.expiry_date);
        const diffTime = Math.abs(expiryDate.getTime() - today.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return sum + diffDays;
      }, 0);
      
      avgDaysUntilExpiry = totalDays / nonExpiredBeers.length;
    }

    // Get top beer types
    const typeCount: Record<string, number> = {};
    beers.forEach(beer => {
      if (beer.type) {
        typeCount[beer.type] = (typeCount[beer.type] || 0) + 1;
      }
    });

    const topBeerTypes = Object.entries(typeCount)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    return {
      totalBeers,
      expiredBeers,
      expiringSoon,
      avgDaysUntilExpiry,
      topBeerTypes
    };
  }
}

export default new BeerService(); 