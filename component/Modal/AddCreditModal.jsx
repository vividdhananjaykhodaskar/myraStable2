import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddCreditModal({ amount, setAmount, handlePay }) {
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const validateAndSubmit = (value) => {
    const amount = Number(value);
    if (!amount) {
      setError("Credit amount is required.");
      return;
    }
    if (amount <= 0 || amount % 5 !== 0) {
      setError("Credit amount must be a positive number and a multiple of 5.");
      return;
    }
    setError("");
    console.log("Credits added:", amount);
    handlePay();
    setIsOpen(false)
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Credits</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Add Credits to Your Account</DialogTitle>
          <DialogDescription>
            Enter the required details to add credits. Click "Add Credits" when you're ready.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Credit Amount Field */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="creditAmount" className="text-left">
              Credits
            </Label>
            <Input
              id="creditAmount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            className="w-full"
            onClick={() => validateAndSubmit(amount)}
          >
            Add Credits
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
