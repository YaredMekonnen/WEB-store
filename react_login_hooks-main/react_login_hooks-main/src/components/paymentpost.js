import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function Paymentpost() {
  const navigate = useNavigate();
  const location = useLocation();
  const props = location.state;

  useEffect(() => {
    // Load PayPal SDK script dynamically
    const script = document.createElement('script');
    script.src =
      'https://www.paypal.com/sdk/js?client-id=AXOkzBh3I5x1tDQFFI1lvc3sS-hHot8iKThbKTn_zT5KDY_7wiVL6aifg8nEpVodI5Gjltp9LYgixRi7';
    script.async = true;

    script.onload = () => {
      // Render PayPal Buttons
      window.paypal
        .Buttons({
          createOrder: function (data, actions) {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: "3",
                  },
                },
              ],
            });
          },
          onApprove: function (data, actions) {
            return actions.order
              .capture()
              .then(function (details) {
                alert(
                  "Transaction completed by " +
                    details.payer.name.given_name
                );
                // Redirect or navigate to a success page
                navigate('/posts/createposts', { state: props });

                // Important: Prevent the default PayPal redirect
                return actions.redirect();
              });
          },
        })
        .render('#paypal-button-container'); // Replace '#paypal-button-container' with the ID of the container where you want to render the buttons
    };

    document.body.appendChild(script);
    return () => {
      // Cleanup script on component unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [navigate, props]);

  return <div id="paypal-button-container"></div>;
}
