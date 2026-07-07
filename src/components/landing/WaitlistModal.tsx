import { AccessRequestForm } from "@/components/AccessRequestForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface WaitlistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WaitlistModal = ({ open, onOpenChange }: WaitlistModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-[hsl(var(--primary)/0.25)] bg-[var(--landing-surface-elevated)] text-[var(--landing-text)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-[var(--landing-text)]">
            Create your own note
          </DialogTitle>
          <DialogDescription className="text-[var(--landing-text-muted)]">
            Join the waitlist — we&apos;ll notify you when custom notes are available.
          </DialogDescription>
        </DialogHeader>
        <div className="[&_label]:text-[var(--landing-text-muted)] [&_input]:border-[hsl(var(--primary)/0.25)] [&_input]:bg-[#0a0a0f] [&_input]:text-[var(--landing-text)] [&_button]:landing-glow-btn [&_button]:rounded-sm [&_button]:font-mono [&_button]:uppercase [&_button]:tracking-wider">
          <AccessRequestForm submitLabel="Join waitlist" emailPlaceholder="Email address" />
        </div>
      </DialogContent>
    </Dialog>
  );
};
