import { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";

const AddressAutocomplete = ({ 
  value, 
  onChange, 
  placeholder = "Enter address",
  required = false,
  className = "",
  error = null
}) => {
  const containerRef = useRef(null);
  const autocompleteElementRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initializeAutocompleteElement = async () => {
      try {
        if (!window.google || !window.google.maps) {
          console.error("Google Maps not loaded");
          return;
        }

        // Load the PlaceAutocompleteElement
        const { PlaceAutocompleteElement } = await window.google.maps.importLibrary("places");

        // Clean up existing element
        if (autocompleteElementRef.current && autocompleteElementRef.current.parentNode) {
          autocompleteElementRef.current.parentNode.removeChild(autocompleteElementRef.current);
        }

        const container = containerRef.current;
        if (container) {
          // Create PlaceAutocompleteElement
          const placeAutocomplete = new PlaceAutocompleteElement();
          
          // Style the element
          placeAutocomplete.style.width = '100%';
          placeAutocomplete.style.display = 'block';
          placeAutocomplete.style.borderRadius = '0.375rem';
          placeAutocomplete.style.borderWidth = '1px';
          placeAutocomplete.style.borderColor = error ? '#ef4444' : '#d1d5db';
          placeAutocomplete.style.backgroundColor = '#ffffff';
          placeAutocomplete.style.color = '#1f2937';
          placeAutocomplete.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
          placeAutocomplete.style.padding = '0.5rem 0.75rem';
          placeAutocomplete.style.fontSize = '0.875rem';
          placeAutocomplete.style.transition = 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out';
          
          
          // Add focus styles
          placeAutocomplete.addEventListener('focus', () => {
            placeAutocomplete.style.borderColor = '#3b82f6';
            placeAutocomplete.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
          });
          
          placeAutocomplete.addEventListener('blur', () => {
            placeAutocomplete.style.borderColor = error ? '#ef4444' : '#d1d5db';
            placeAutocomplete.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
          });

          // Set placeholder and required
          const input = placeAutocomplete.querySelector('input');
          if (input) {
            input.placeholder = placeholder;
            input.required = required;
            
            // Simple styling for the input element
            input.style.color = '#1f2937';
            input.style.backgroundColor = 'transparent';
            input.style.border = 'none';
            input.style.outline = 'none';
            
            // Set initial value if exists
            if (value) {
              input.value = value;
            }
            
            // Handle manual input changes
            input.addEventListener('input', (e) => {
              onChange(e.target.value);
            });
          }

          // Add place selection event listener
          placeAutocomplete.addEventListener('gmp-select', async (event) => {
            try {
              const placePrediction = event.placePrediction;
              const place = placePrediction.toPlace();
              
              // Fetch place details
              await place.fetchFields({ 
                fields: ['displayName', 'formattedAddress'] 
              });

              const address = place.formattedAddress || place.displayName;
              onChange(address);
            } catch (error) {
              console.error('Error handling place selection:', error);
            }
          });

          // Append to container
          container.appendChild(placeAutocomplete);
          autocompleteElementRef.current = placeAutocomplete;
          setIsLoaded(true);
        }

      } catch (error) {
        console.error('Error initializing PlaceAutocompleteElement:', error);
      }
    };

    if (window.google && window.google.maps) {
      initializeAutocompleteElement();
    }

    // Cleanup function
    return () => {
      if (autocompleteElementRef.current && autocompleteElementRef.current.parentNode) {
        autocompleteElementRef.current.parentNode.removeChild(autocompleteElementRef.current);
      }
      autocompleteElementRef.current = null;
    };
  }, []); // Only run on mount/unmount

  // Update input value when value prop changes (but avoid interfering with typing)
  useEffect(() => {
    if (autocompleteElementRef.current && isLoaded) {
      const input = autocompleteElementRef.current.querySelector('input');
      if (input && input.value !== value && document.activeElement !== input) {
        input.value = value || '';
      }
    }
  }, [value, isLoaded]);

  return (
    <div className={`w-full ${className}`}>
      <div 
        ref={containerRef} 
        className="w-full"
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

AddressAutocomplete.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
  error: PropTypes.string,
};

export default AddressAutocomplete;