import { NextResponse } from 'next/server';
import { verifyOtp, setUserPassword } from '@/lib/securityStore';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email = 'contactvedantverse@gmail.com', newPassword, otp } = body;
    const cleanEmail = email.trim().toLowerCase();

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json({
        success: false,
        error: 'Password must be at least 8 characters in length.',
      }, { status: 400 });
    }

    if (!/[0-9]/.test(newPassword)) {
      return NextResponse.json({
        success: false,
        error: 'Password must contain at least one numeric character (0-9).',
      }, { status: 400 });
    }

    if (!/[!@#$%^&*]/.test(newPassword)) {
      return NextResponse.json({
        success: false,
        error: 'Password must contain at least one special symbol (!@#$%^&*).',
      }, { status: 400 });
    }

    if (!otp) {
      return NextResponse.json({
        success: false,
        error: 'Authorization 4-digit OTP is required to set new password.',
      }, { status: 400 });
    }

    // Verify OTP
    const verification = verifyOtp(cleanEmail, otp);
    if (!verification.success) {
      return NextResponse.json({
        success: false,
        error: verification.error || 'Invalid authorization OTP. Verification failed.',
      }, { status: 401 });
    }

    // Set new password
    setUserPassword(cleanEmail, newPassword);

    return NextResponse.json({
      success: true,
      message: 'Master password successfully configured!',
    });
  } catch (error: any) {
    console.error('Password setup error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to configure password.',
    }, { status: 500 });
  }
}
