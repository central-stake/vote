import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Candidate } from "@/lib/candidates";
import { Info, SquareArrowOutUpRight } from "lucide-react";

export default function ProgrammeDetails({ candidate } : { candidate: Candidate }) {
  return (
    <a href={candidate.websiteUrl} target="_blank">
      <SquareArrowOutUpRight className="text-muted-foreground w-4 h-4 ml-2" />
    </a>
  );

  return (
    <Dialog>
      <DialogTrigger>
        <Info className="text-muted-foreground w-4 h-4 ml-2" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-2">
            Programme
          </DialogTitle>
          <div className="p-4 text-sm">
            {candidate.programme}
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button>
            <a href={candidate.websiteUrl} target="_blank">
              Open the website <SquareArrowOutUpRight className="ml-2 inline w-4 h-4" />
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
