import { supabase } from '@/lib/customSupabaseClient';
import { inputSanitizer } from '@/lib/inputSanitizer';

/**
 * Service to handle contact message submissions
 */
export const submitContactMessage = async (formData) => {
  const { nama, email, nomor_telepon, subjek, pesan } = formData;

  // 1. Validation
  if (!nama || !email || !subjek || !pesan) {
    return { success: false, error: 'Nama, Email, Subjek, dan Pesan wajib diisi.' };
  }

  const validEmail = inputSanitizer.validateEmail(email);
  if (!validEmail) {
    return { success: false, error: 'Format email tidak valid.' };
  }

  // 2. Sanitization
  const cleanData = {
    nama: inputSanitizer.sanitizeText(nama),
    email: validEmail,
    nomor_telepon: nomor_telepon ? inputSanitizer.sanitizeText(nomor_telepon) : null,
    subjek: inputSanitizer.sanitizeText(subjek),
    pesan: inputSanitizer.sanitizeText(pesan),
    status: 'unread'
  };

  // 3. Database Insertion
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([cleanData])
      .select();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error submitting contact message:', error);
    return { success: false, error: 'Gagal mengirim pesan. Silakan coba lagi nanti.' };
  }
};