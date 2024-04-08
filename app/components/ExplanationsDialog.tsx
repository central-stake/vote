import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Check } from "lucide-react";

export default function ExplanationDialog() {
  return (
    <Dialog>
      <DialogTrigger className={buttonVariants({variant: 'secondary'})}>
        How does it work?
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-6">
            How does it work?
          </DialogTitle>
          <div className="p-6">
            <ul className="space-y-4">
              <li className="flex items-center">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-base">
                    Todo
                  </p>
              </li>
              <li className="flex items-center">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-base">
                    Todo
                  </p>
              </li>
              <li className="flex items-center">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-base">
                    Todo
                  </p>
              </li>
            </ul>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
