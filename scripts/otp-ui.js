// ========================================================
// Client-Side OTP Modal Controller for lost-and-found-js
// ========================================================

(function($) {
  let activeMobile = '';
  let resendTimerInterval = null;
  let expireTimerInterval = null;
  let currentDemoOtp = '';

  function showAlert(message, type = 'danger') {
    const icon = type === 'success' ? 'check-circle' : 'exclamation-triangle';
    $('#otpAlertContainer').html(`
      <div class="alert alert-${type} alert-dismissible fade show d-flex align-items-center" role="alert">
        <i class="bi bi-${icon}-fill me-2 fs-5"></i>
        <div class="flex-grow-1">${message}</div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `);
  }

  function clearAlert() {
    $('#otpAlertContainer').empty();
  }

  function startResendCountdown(seconds = 60) {
    clearInterval(resendTimerInterval);
    let remaining = seconds;
    $('#btnResendOtp').addClass('disabled');
    $('#resendTimerSpan').show();
    $('#resendSeconds').text(remaining);

    resendTimerInterval = setInterval(() => {
      remaining--;
      if (remaining <= 0) {
        clearInterval(resendTimerInterval);
        $('#btnResendOtp').removeClass('disabled');
        $('#resendTimerSpan').hide();
      } else {
        $('#resendSeconds').text(remaining);
      }
    }, 1000);
  }

  function startExpireCountdown(seconds = 300) {
    clearInterval(expireTimerInterval);
    let remaining = seconds;
    function formatTime(s) {
      const m = Math.floor(s / 60);
      const sec = s % 60;
      return String(m).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
    }
    $('#otpTimerSeconds').text(formatTime(remaining));

    expireTimerInterval = setInterval(() => {
      remaining--;
      if (remaining <= 0) {
        clearInterval(expireTimerInterval);
        $('#otpTimerSeconds').text('Expired');
        showAlert('This OTP has expired. Please click Resend OTP to get a new code.', 'warning');
      } else {
        $('#otpTimerSeconds').text(formatTime(remaining));
      }
    }, 1000);
  }

  $(document).ready(function() {
    // Step 1: Send OTP
    $('#stepMobileForm').on('submit', async function(e) {
      e.preventDefault();
      clearAlert();
      const mobile = $('#inputMobileNumber').val().trim();
      const $btn = $('#btnSendOtp');
      $btn.prop('disabled', true);
      $btn.find('.spinner-border').removeClass('d-none');

      try {
        const resp = await window.AuthManager.sendMobileOtp(mobile);
        $btn.prop('disabled', false);
        $btn.find('.spinner-border').addClass('d-none');

        if (resp.status === 'success') {
          activeMobile = resp.mobile;
          $('#displayTargetMobile').text('+91 ' + activeMobile);

          if (resp.is_demo && resp.demo_otp) {
            currentDemoOtp = resp.demo_otp;
            $('#demoOtpCodeText').text(resp.demo_otp);
            $('#demoOtpBanner').removeClass('d-none');
          } else {
            $('#demoOtpBanner').addClass('d-none');
          }

          $('#stepMobileForm').addClass('d-none');
          $('#stepOtpForm').removeClass('d-none');
          $('#inputOtpCode').val('').focus();

          startResendCountdown(resp.cooldown_seconds || 60);
          startExpireCountdown(resp.expires_in_seconds || 300);
        } else if (resp.status === 'cooldown') {
          showAlert(resp.msg, 'warning');
        } else {
          showAlert(resp.msg || 'Unable to send OTP. Please check the mobile number.');
        }
      } catch (err) {
        $btn.prop('disabled', false);
        $btn.find('.spinner-border').addClass('d-none');
        showAlert('Error generating OTP: ' + err.message);
      }
    });

    // Quick-fill demo OTP button
    $('#btnQuickFillOtp').on('click', function() {
      if (currentDemoOtp) {
        $('#inputOtpCode').val(currentDemoOtp);
      }
    });

    // Change Mobile button
    $('#btnChangeMobile').on('click', function() {
      clearInterval(resendTimerInterval);
      clearInterval(expireTimerInterval);
      clearAlert();
      $('#stepOtpForm').addClass('d-none');
      $('#stepMobileForm').removeClass('d-none');
      $('#inputMobileNumber').focus();
    });

    // Resend OTP button
    $('#btnResendOtp').on('click', function() {
      if ($(this).hasClass('disabled')) return;
      clearAlert();
      $('#stepMobileForm').submit();
    });

    // Step 2: Verify OTP
    $('#stepOtpForm').on('submit', async function(e) {
      e.preventDefault();
      clearAlert();
      const otp = $('#inputOtpCode').val().trim();
      const $btn = $('#btnVerifyOtp');
      $btn.prop('disabled', true);
      $btn.find('.spinner-border').removeClass('d-none');

      try {
        const resp = await window.AuthManager.verifyMobileOtp(activeMobile, otp);
        $btn.prop('disabled', false);
        $btn.find('.spinner-border').addClass('d-none');

        if (resp.status === 'success') {
          clearInterval(resendTimerInterval);
          clearInterval(expireTimerInterval);

          if (resp.is_new) {
            $('#stepOtpForm').addClass('d-none');
            $('#stepProfileForm').removeClass('d-none');
            $('#inputFirstName').focus();
            showAlert(resp.msg, 'info');
          } else {
            showAlert(resp.msg, 'success');
            setTimeout(() => {
              const modalEl = document.getElementById('otpLoginModal');
              const modal = bootstrap.Modal.getInstance(modalEl);
              if (modal) modal.hide();
              window.location.reload();
            }, 700);
          }
        } else {
          showAlert(resp.msg || 'OTP Verification failed.');
        }
      } catch (err) {
        $btn.prop('disabled', false);
        $btn.find('.spinner-border').addClass('d-none');
        showAlert('Error verifying OTP: ' + err.message);
      }
    });

    // Step 3: Complete Profile
    $('#stepProfileForm').on('submit', async function(e) {
      e.preventDefault();
      clearAlert();
      const firstname = $('#inputFirstName').val().trim();
      const lastname = $('#inputLastName').val().trim();
      const email = $('#inputEmail').val().trim();

      const $btn = $('#btnCompleteProfile');
      $btn.prop('disabled', true);
      $btn.find('.spinner-border').removeClass('d-none');

      try {
        const resp = await window.AuthManager.completeMobileRegistration(activeMobile, firstname, lastname, email);
        $btn.prop('disabled', false);
        $btn.find('.spinner-border').addClass('d-none');

        if (resp.status === 'success') {
          showAlert(resp.msg, 'success');
          setTimeout(() => {
            const modalEl = document.getElementById('otpLoginModal');
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
            window.location.reload();
          }, 800);
        } else {
          showAlert(resp.msg || 'Profile registration failed.');
        }
      } catch (err) {
        $btn.prop('disabled', false);
        $btn.find('.spinner-border').addClass('d-none');
        showAlert('Error saving profile: ' + err.message);
      }
    });

    // Reset forms when modal closes
    $('#otpLoginModal').on('hidden.bs.modal', function() {
      clearInterval(resendTimerInterval);
      clearInterval(expireTimerInterval);
      clearAlert();
      $('#stepOtpForm, #stepProfileForm').addClass('d-none');
      $('#stepMobileForm').removeClass('d-none');
      $('#inputMobileNumber').val('');
      $('#inputOtpCode').val('');
      $('#inputFirstName').val('');
      $('#inputLastName').val('');
      $('#inputEmail').val('');
    });
  });
})(jQuery);

