import React from "react";
import Button from "../ui/Button";
import { useAuth } from "../../contexts/AuthContext";

export default function SponsorshipPlanCard({ 
  plan, 
  eventId,
  onAddToCart,
  isInCart = false,
  isLoading = false
}) {
  const { isAuthenticated, isSponsor } = useAuth();

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(plan.id);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900">{plan.title}</h3>
        <p className="mt-1 text-2xl font-extrabold text-indigo-600">${plan.price}</p>
        
        <p className="mt-4 text-gray-500">{plan.description}</p>
        
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-900">Benefits:</h4>
          <ul className="mt-2 space-y-2">
            {plan.benefits && plan.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-600">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-8">
          {isAuthenticated && isSponsor ? (
            <Button
              variant={isInCart ? "secondary" : "primary"}
              className="w-full"
              onClick={handleAddToCart}
              disabled={isInCart || isLoading}
            >
              {isLoading ? "Processing..." : isInCart ? "Added to Cart" : "Add to Cart"}
            </Button>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.location.href = "/login"}
            >
              Sign in to Sponsor
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}