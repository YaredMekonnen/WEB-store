import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const props = location.state;

  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://www.paypal.com/sdk/js?client-id=AXOkzBh3I5x1tDQFFI1lvc3sS-hHot8iKThbKTn_zT5KDY_7wiVL6aifg8nEpVodI5Gjltp9LYgixRi7';
    script.async = true;
  
    script.onload = () => {
      window.paypal
        .Buttons({
          createOrder: function (data, actions) {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: '0.01',
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
                  'Transaction completed by ' + details.payer.name.given_name
                );
                // Redirect or navigate to a success page
                navigate('/posts/contact', { state: props });
  
                // Important: Prevent the default PayPal redirect
                return actions.redirect();
              });
          },
        })
        .render('#paypal-button-container');
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
