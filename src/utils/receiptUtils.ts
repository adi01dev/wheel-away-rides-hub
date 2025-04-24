
import { formatIndianCurrency } from './currencyUtils';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

// Define the booking type
interface BookingReceipt {
  id: string;
  bookingDate: Date;
  startDate: Date;
  endDate: Date;
  carDetails: {
    name: string;
    category: string;
  };
  renterDetails: {
    name: string;
    email: string;
    phone?: string;
  };
  ownerDetails: {
    name: string;
    email: string;
    phone?: string;
  };
  priceBreakdown: {
    basePrice: number;
    serviceFee: number;
    taxes: number;
    discount?: number;
    total: number;
  };
  paymentMethod: string;
}

/**
 * Generate and download a PDF receipt for a booking
 * @param booking - Booking details used to generate the receipt
 */
export const generateReceipt = (booking: BookingReceipt) => {
  // Create new PDF document
  const doc = new jsPDF();
  
  // Add company logo/header
  doc.setFontSize(20);
  doc.setTextColor(0, 128, 128); // Teal color
  doc.text('WheelAway', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text('Car Rental Receipt', 105, 30, { align: 'center' });

  // Add receipt information
  doc.setTextColor(0);
  doc.setFontSize(10);
  
  // Left column - Booking details
  doc.text('Receipt #:', 15, 45);
  doc.text(booking.id, 45, 45);
  
  doc.text('Booking Date:', 15, 52);
  doc.text(format(booking.bookingDate, 'dd MMM yyyy'), 45, 52);
  
  doc.text('Rental Period:', 15, 59);
  doc.text(`${format(booking.startDate, 'dd MMM yyyy')} - ${format(booking.endDate, 'dd MMM yyyy')}`, 45, 59);
  
  // Right column - Car details
  doc.text('Car:', 120, 45);
  doc.text(booking.carDetails.name, 150, 45);
  
  doc.text('Category:', 120, 52);
  doc.text(booking.carDetails.category, 150, 52);

  // Customer and Owner details
  doc.setFontSize(12);
  doc.setTextColor(0, 128, 128);
  doc.text('Customer Details', 15, 75);
  
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text(booking.renterDetails.name, 15, 82);
  doc.text(booking.renterDetails.email, 15, 89);
  if (booking.renterDetails.phone) {
    doc.text(booking.renterDetails.phone, 15, 96);
  }
  
  doc.setFontSize(12);
  doc.setTextColor(0, 128, 128);
  doc.text('Car Owner', 120, 75);
  
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text(booking.ownerDetails.name, 120, 82);
  doc.text(booking.ownerDetails.email, 120, 89);
  if (booking.ownerDetails.phone) {
    doc.text(booking.ownerDetails.phone, 120, 96);
  }
  
  // Price breakdown table
  doc.setFontSize(12);
  doc.setTextColor(0, 128, 128);
  doc.text('Price Breakdown', 15, 115);
  
  const tableData = [
    ['Description', 'Amount'],
    ['Base rental price', formatIndianCurrency(booking.priceBreakdown.basePrice)],
    ['Service fee', formatIndianCurrency(booking.priceBreakdown.serviceFee)],
    ['Taxes', formatIndianCurrency(booking.priceBreakdown.taxes)]
  ];
  
  if (booking.priceBreakdown.discount && booking.priceBreakdown.discount > 0) {
    tableData.push(['Discount', `- ${formatIndianCurrency(booking.priceBreakdown.discount)}`]);
  }
  
  tableData.push(['Total', formatIndianCurrency(booking.priceBreakdown.total)]);
  
  (doc as any).autoTable({
    startY: 120,
    head: [tableData[0]],
    body: tableData.slice(1),
    theme: 'striped',
    headStyles: { 
      fillColor: [0, 128, 128],
      textColor: [255, 255, 255]
    },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 60, halign: 'right' }
    }
  });
  
  // Payment information
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text(`Payment Method: ${booking.paymentMethod}`, 15, finalY);
  
  // Terms and conditions
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text('This is an electronically generated receipt and does not require a signature.', 15, finalY + 15);
  
  // Add footer with page number
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text('WheelAway Car Rentals - Thank you for your business!', 105, 285, { align: 'center' });
    doc.text(`Page ${i} of ${pageCount}`, 195, 285, { align: 'right' });
  }
  
  // Download the PDF
  doc.save(`WheelAway_Receipt_${booking.id}.pdf`);
  
  return true;
};

/**
 * Generate a sample receipt for testing purposes
 */
export const generateSampleReceipt = () => {
  const sampleBooking: BookingReceipt = {
    id: 'BK-' + Math.floor(100000 + Math.random() * 900000),
    bookingDate: new Date(),
    startDate: new Date(),
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
    carDetails: {
      name: 'Honda City',
      category: 'Sedan'
    },
    renterDetails: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+91 9876543210'
    },
    ownerDetails: {
      name: 'Car Owner',
      email: 'owner@example.com',
      phone: '+91 9876543211'
    },
    priceBreakdown: {
      basePrice: 5000,
      serviceFee: 500,
      taxes: 825,
      discount: 200,
      total: 6125
    },
    paymentMethod: 'Credit Card'
  };
  
  return generateReceipt(sampleBooking);
};
