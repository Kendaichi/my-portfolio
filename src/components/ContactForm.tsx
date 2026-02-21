import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-12 space-y-3">
        <p className="text-xl font-medium">Message sent.</p>
        <p className="text-muted-foreground">I'll get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          placeholder="Name"
          required
          className="bg-card border-border/50 focus:border-foreground/30"
        />
        <Input
          type="email"
          placeholder="Email"
          required
          className="bg-card border-border/50 focus:border-foreground/30"
        />
      </div>
      <Textarea
        placeholder="Tell me about your project..."
        rows={5}
        required
        className="bg-card border-border/50 focus:border-foreground/30 resize-none"
      />
      <Button variant="hero" size="lg" type="submit" className="gap-2">
        Let's Build Something
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
