import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
          to_email: 'franclloyddagdag2130@gmail.com',
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      toast.success("Message sent! I'll get back to you soon.");
      setForm({ name: '', email: '', message: '' });
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          className="bg-card border-border/50 focus:border-foreground/30 h-12 text-base"
        />
        <Input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="bg-card border-border/50 focus:border-foreground/30 h-12 text-base"
        />
      </div>
      <Textarea
        name="message"
        placeholder="Tell me about your project..."
        rows={8}
        value={form.message}
        onChange={handleChange}
        required
        className="bg-card border-border/50 focus:border-foreground/30 resize-none text-base"
      />
      <Button variant="hero" size="lg" type="submit" disabled={loading} className="gap-2">
        {loading ? 'Sending...' : "Let's Build Something"}
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
