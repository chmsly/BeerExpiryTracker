import { useState, useEffect } from 'react';
import { BeerDTO, BeerFormData } from '@/services/beer.service';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface BeerFormProps {
  initialData?: BeerDTO;
  onSubmit: (data: BeerFormData) => Promise<void>;
  isSubmitting: boolean;
}

export default function BeerForm({ initialData, onSubmit, isSubmitting }: BeerFormProps) {
  const [brandName, setBrandName] = useState('');
  const [productName, setProductName] = useState('');
  const [type, setType] = useState('');
  const [expiryDate, setExpiryDate] = useState<Date>(new Date());
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Set initial data if provided (for edit mode)
  useEffect(() => {
    if (initialData) {
      setBrandName(initialData.brandName);
      setProductName(initialData.productName);
      setType(initialData.type || '');
      setExpiryDate(new Date(initialData.expiryDate));
      
      if (initialData.imageUrl) {
        setImagePreview(initialData.imageUrl);
      }
    }
  }, [initialData]);

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData: BeerFormData = {
      brandName,
      productName,
      type: type || undefined,
      expiryDate,
      image: image || undefined,
    };
    
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="brandName" className="block text-sm font-medium text-gray-700 mb-1">
            Brand Name*
          </label>
          <input
            id="brandName"
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Enter brand name"
            required
          />
        </div>
        
        <div>
          <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
            Product Name*
          </label>
          <input
            id="productName"
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Enter product name"
            required
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
          Type (optional)
        </label>
        <input
          id="type"
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          placeholder="e.g., IPA, Lager, Stout"
        />
      </div>
      
      <div>
        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
          Expiry Date*
        </label>
        <DatePicker
          id="expiryDate"
          selected={expiryDate}
          onChange={(date: Date | null) => date && setExpiryDate(date)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          dateFormat="MMMM d, yyyy"
          minDate={new Date()}
          required
        />
      </div>
      
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
          Image (optional)
        </label>
        <input
          id="image"
          type="file"
          onChange={handleImageChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          accept="image/*"
        />
        
        {imagePreview && (
          <div className="mt-2 relative">
            <img
              src={imagePreview}
              alt="Beer preview"
              className="h-48 w-auto object-contain border border-gray-300 rounded-md"
            />
            <button
              type="button"
              onClick={() => {
                setImage(null);
                setImagePreview(null);
              }}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition"
              title="Remove image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-md text-white font-medium ${
            isSubmitting ? 'bg-amber-400' : 'bg-amber-600 hover:bg-amber-700'
          } transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2`}
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Beer' : 'Add Beer'}
        </button>
      </div>
    </form>
  );
} 