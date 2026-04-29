import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { BookOpenCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

const schema = z.object({
  email: z.string().trim().email("Email tidak valid").max(255),
  password: z.string().min(6, "Password minimal 6 karakter").max(72),
});

const Auth = () => {
  const navigate = useNavigate();
  const { user, loading, signIn, signUp } = useAuth();
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!loading && user) navigate("/admin", { replace: true });
  }, [user, loading, navigate]);

  const handle = async (mode: "login" | "signup") => {
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast({ title: "Validasi gagal", description: parsed.error.errors[0].message, variant: "destructive" });
      return;
    }
    setBusy(true);
    const { error } = mode === "login" ? await signIn(email, password) : await signUp(email, password);
    setBusy(false);
    if (error) {
      toast({ title: mode === "login" ? "Login gagal" : "Daftar gagal", description: error, variant: "destructive" });
    } else if (mode === "signup") {
      toast({ title: "Akun dibuat", description: "Cek email untuk verifikasi (jika diminta), lalu login." });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary/40 via-background to-background p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <BookOpenCheck className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl">Admin · Kelas Qur'an</span>
        </Link>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Masuk Admin</CardTitle>
            <CardDescription>
              Login untuk mengelola data laporan murid.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Daftar</TabsTrigger>
              </TabsList>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@kelasquran.id" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                </div>
              </div>

              <TabsContent value="login" className="mt-4">
                <Button onClick={() => handle("login")} disabled={busy} className="w-full">
                  {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                  Masuk
                </Button>
              </TabsContent>
              <TabsContent value="signup" className="mt-4 space-y-3">
                <Button onClick={() => handle("signup")} disabled={busy} className="w-full" variant="outline">
                  {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                  Daftar Akun Baru
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Akun baru belum berperan admin. Pemilik proyek harus menambahkan peran admin lewat SQL Editor Supabase.
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
