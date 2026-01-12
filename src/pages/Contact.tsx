import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("contact_messages")
        .insert([
          {
            name: formData.name,
            email: formData.email,
            message: formData.message,
          },
        ]);

      if (error) throw error;

      toast({
        title: "Message sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        message: "",
      });

      // Optionally navigate back after a delay
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 max-w-2xl">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-4">
            Contact Us
          </h1>
          <p className="text-base sm:text-lg text-foreground/80 text-center">
            Have questions or want to learn more? We'd love to hear from you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Tell us how we can help..."
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              className="resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              type="submit"
              variant="default"
              className="w-full sm:w-auto h-12 sm:h-14 text-base sm:text-lg rounded-2xl px-6 sm:px-8"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto h-12 sm:h-14 text-base sm:text-lg rounded-2xl px-6 sm:px-8"
              onClick={() => navigate("/")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
