import { useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { callPurchaseSpace } from "@levelup/shared-services";
import { useConsumerStore } from "@levelup/shared-stores";
import { getApiErrorMessage } from "@levelup/shared-hooks";
import {
  Button,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@levelup/shared-ui";
import {
  ArrowLeft,
  BookOpen,
  ShoppingCart,
  Trash2,
  CheckCircle2,
} from "lucide-react";


export default function CheckoutPage() {
  const queryClient = useQueryClient();
  const { cart, removeFromCart, clearCart, markPurchased, cartTotal } =
    useConsumerStore();
  const [purchasing, setPurchasing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showCheckoutConfirm, setShowCheckoutConfirm] = useState(false);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setPurchasing(true);
    setErrors([]);

    const purchasedIds: string[] = [];
    const failedErrors: string[] = [];

    // Process each cart item sequentially
    for (const item of cart) {
      try {
        await callPurchaseSpace({ spaceId: item.spaceId });
        purchasedIds.push(item.spaceId);
      } catch (err) {
        const { message } = getApiErrorMessage(err);
        failedErrors.push(message || `Failed to enroll in "${item.title}"`);
      }
    }

    if (purchasedIds.length > 0) {
      markPurchased(purchasedIds);
      queryClient.invalidateQueries({ queryKey: ["store-spaces"] });
      queryClient.invalidateQueries({ queryKey: ["consumer-enrolled-spaces"] });
    }

    if (failedErrors.length > 0) {
      setErrors(failedErrors);
    }

    if (failedErrors.length === 0) {
      setCompleted(true);
    }

    setPurchasing(false);
  };

  const total = cartTotal();

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <CheckCircle2 className="h-16 w-16 text-emerald-600 dark:text-emerald-400" />
        <h1 className="text-2xl font-bold">Enrollment Complete!</h1>
        <p className="text-sm text-muted-foreground">
          You have been enrolled in all selected spaces.
        </p>
        <div className="flex items-center gap-3 pt-4">
          <Link
            to="/consumer"
            className="inline-flex h-10 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Go to My Learning
          </Link>
          <Link
            to="/store"
            className="inline-flex h-10 items-center rounded-md border px-6 text-sm font-medium hover:bg-accent"
          >
            Continue Browsing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/store"
        className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Store
      </Link>

      <div className="flex items-center gap-2">
        <ShoppingCart className="h-5 w-5" />
        <h1 className="text-2xl font-bold">Checkout</h1>
      </div>

      {errors.length > 0 && (
        <div className="rounded-md bg-destructive/10 p-4 space-y-1">
          {errors.map((err, i) => (
            <p key={i} className="text-sm text-destructive">
              {err}
            </p>
          ))}
        </div>
      )}

      {cart.length === 0 && !completed && (
        <div className="py-12 text-center">
          <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            Your cart is empty.
          </p>
          <Link
            to="/store"
            className="mt-4 inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Browse Store
          </Link>
        </div>
      )}

      {cart.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            {cart.map((item) => (
              <div
                key={item.spaceId}
                className="flex items-center gap-4 rounded-lg border bg-card p-4"
              >
                {item.thumbnailUrl ? (
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="h-16 w-24 rounded object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-24 items-center justify-center rounded bg-muted">
                    <BookOpen className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1">
                  <Link
                    to={`/store/${item.spaceId}`}
                    className="font-medium hover:text-primary"
                  >
                    {item.title}
                  </Link>
                  <p className="text-sm font-semibold">
                    {item.price === 0
                      ? "Free"
                      : `${item.currency} ${item.price}`}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.spaceId)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Remove from cart"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}

            <button
              onClick={() => setShowClearConfirm(true)}
              className="text-sm text-muted-foreground hover:text-destructive"
            >
              Clear cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="rounded-lg border bg-card p-6 space-y-4 h-fit">
            <h2 className="font-semibold">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {cart.length} {cart.length === 1 ? "space" : "spaces"}
                </span>
                <span>
                  {total === 0 ? "Free" : `${cart[0]?.currency ?? 'USD'} ${total.toFixed(2)}`}
                </span>
              </div>
              <div className="border-t pt-2 flex items-center justify-between font-semibold">
                <span>Total</span>
                <span className="text-lg">
                  {total === 0 ? "Free" : `${cart[0]?.currency ?? 'USD'} ${total.toFixed(2)}`}
                </span>
              </div>
            </div>
            <Button
              onClick={() => setShowCheckoutConfirm(true)}
              disabled={purchasing}
              className="w-full"
            >
              {purchasing
                ? "Processing..."
                : total === 0
                  ? "Enroll Now"
                  : "Complete Purchase"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              {total === 0
                ? "No payment required for free spaces."
                : "Payment processing coming soon. Enrollment is free during beta."}
            </p>
          </div>
        </div>
      )}

      {/* Clear cart confirmation */}
      <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear cart?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all {cart.length} item{cart.length !== 1 ? 's' : ''} from your cart.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => clearCart()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear Cart
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Checkout confirmation */}
      <AlertDialog open={showCheckoutConfirm} onOpenChange={setShowCheckoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm enrollment</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to enroll in {cart.length} space{cart.length !== 1 ? 's' : ''}.
              {total > 0 && ` Total: ${cart[0]?.currency ?? 'USD'} ${total.toFixed(2)}.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCheckout}>
              {total === 0 ? "Enroll Now" : "Complete Purchase"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
