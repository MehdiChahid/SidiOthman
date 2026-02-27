import { Mail, Phone, Linkedin, Globe, Award, GraduationCap, Scale, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import logoDaeb from "@/assets/logo-daeb.png";
import logoUniversite from "@/assets/logo-universite.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 flex items-center justify-center p-4 md:p-8">
      <Card className="w-full max-w-5xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border-0 overflow-hidden animate-scale-in">
        <CardContent className="p-0">
          {/* Modern Header with Gradient */}
          <div className="relative bg-gradient-to-r from-primary via-primary to-primary/90 p-8 md:p-12 overflow-hidden">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
            </div>
            
            <div className="relative z-10">
              {/* Logos with modern layout */}
              <div className="flex justify-between items-start gap-6 mb-8">
                <div className="flex-1 flex justify-start">
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <img 
                      src={logoUniversite} 
                      alt="Université Abdelmalek Essaâdi" 
                      className="h-14 md:h-16 object-contain"
                    />
                  </div>
                </div>
                <div className="flex-1 flex justify-end">
                  <div className="bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <img 
                      src={logoDaeb} 
                      alt="Master DAEB" 
                      className="h-14 md:h-16 object-contain"
                    />
                  </div>
                </div>
              </div>
              
              {/* Name and title section */}
              <div className="text-center space-y-4">
                <div className="inline-block">
                  <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-2 tracking-tight">
                    Dr. ALAOUI Faiza
                  </h1>
                  <div className="h-1.5 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full"></div>
                </div>
                
                <div className="flex flex-wrap justify-center gap-2 mt-6">
                  <Badge className="bg-accent text-accent-foreground border-0 px-4 py-2 text-sm font-medium hover:bg-accent/90 transition-colors">
                    Professeure de droit privé
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content with modern cards */}
          <div className="p-8 md:p-12 space-y-8 bg-gradient-to-b from-card to-background/50">
            {/* Roles Section with Icons */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="group bg-gradient-to-br from-primary/5 to-primary/10 p-6 rounded-2xl border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg animate-fade-in">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg mb-1">Coordinatrice</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Master Droit des Affaires et E-Business (DAEB)
                    </p>
                  </div>
                </div>
              </div>

              <div className="group bg-gradient-to-br from-accent/5 to-accent/10 p-6 rounded-2xl border border-accent/20 hover:border-accent/40 transition-all duration-300 hover:shadow-lg animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors flex-shrink-0">
                    <Scale className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg mb-1">Arbitre agréée</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Ministère de Justice
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Administrative Role - Premium Card */}
            <div className="relative group animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-gradient-to-br from-card via-card to-muted/30 p-8 rounded-2xl border border-primary/20 backdrop-blur-sm">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Building2 className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <Badge className="bg-primary/10 text-primary border border-primary/20 mb-3 hover:bg-primary/20 transition-colors">
                      Vice-doyenne
                    </Badge>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      Recherche Scientifique, Coopération et Partenariat
                    </h3>
                  </div>
                </div>
                <div className="space-y-2 pl-[72px]">
                  <p className="text-base text-foreground/90">
                    Faculté des Sciences Juridiques, Économiques et Sociales
                  </p>
                  <p className="text-sm text-muted-foreground">
                    FSJES Tanger
                  </p>
                  <p className="text-base font-semibold text-primary">
                    Université Abdelmalek Essaâdi
                  </p>
                </div>
              </div>
            </div>

            <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* Contact Information - Modern Grid */}
            <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1.5 bg-gradient-to-b from-primary to-accent rounded-full"></div>
                <h2 className="text-2xl font-bold text-foreground">Contact</h2>
              </div>
              
              <div className="grid gap-3">
                {/* Email Addresses */}
                <a 
                  href="mailto:Contact@alaouifaiza.com"
                  className="group flex items-center gap-4 p-5 rounded-xl bg-gradient-to-r from-muted/40 to-muted/20 hover:from-primary/10 hover:to-primary/5 transition-all duration-300 border border-transparent hover:border-primary/30 hover:shadow-lg"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300 flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium group-hover:text-primary transition-colors">
                    Contact@alaouifaiza.com
                  </span>
                </a>

                <a 
                  href="mailto:alaoui.faiza@gmail.com"
                  className="group flex items-center gap-4 p-5 rounded-xl bg-gradient-to-r from-muted/40 to-muted/20 hover:from-primary/10 hover:to-primary/5 transition-all duration-300 border border-transparent hover:border-primary/30 hover:shadow-lg"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300 flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium group-hover:text-primary transition-colors">
                    alaoui.faiza@gmail.com
                  </span>
                </a>

                <a 
                  href="mailto:falaoui@uae.ac.ma"
                  className="group flex items-center gap-4 p-5 rounded-xl bg-gradient-to-r from-muted/40 to-muted/20 hover:from-primary/10 hover:to-primary/5 transition-all duration-300 border border-transparent hover:border-primary/30 hover:shadow-lg"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300 flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium group-hover:text-primary transition-colors">
                    falaoui@uae.ac.ma
                  </span>
                </a>

                {/* Phone */}
                <a 
                  href="tel:+212661165233"
                  className="group flex items-center gap-4 p-5 rounded-xl bg-gradient-to-r from-muted/40 to-muted/20 hover:from-accent/10 hover:to-accent/5 transition-all duration-300 border border-transparent hover:border-accent/30 hover:shadow-lg"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/10 to-accent/20 flex items-center justify-center group-hover:from-accent/20 group-hover:to-accent/30 transition-all duration-300 flex-shrink-0">
                    <Phone className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <span className="text-foreground font-medium group-hover:text-accent-foreground transition-colors">
                    +212 661 165 233
                  </span>
                </a>

                {/* LinkedIn */}
                <a 
                  href="https://www.linkedin.com/in/faiza-alaoui-79540224/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-5 rounded-xl bg-gradient-to-r from-muted/40 to-muted/20 hover:from-[#0077b5]/10 hover:to-[#0077b5]/5 transition-all duration-300 border border-transparent hover:border-[#0077b5]/30 hover:shadow-lg"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0077b5]/10 to-[#0077b5]/20 flex items-center justify-center group-hover:from-[#0077b5]/20 group-hover:to-[#0077b5]/30 transition-all duration-300 flex-shrink-0">
                    <Linkedin className="w-5 h-5 text-[#0077b5]" />
                  </div>
                  <span className="text-foreground font-medium group-hover:text-[#0077b5] transition-colors">
                    LinkedIn Profile
                  </span>
                </a>

                {/* Master Website - Premium Style */}
                <a 
                  href="https://masterdaeb-tanger.ma/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden flex items-center gap-4 p-6 rounded-xl bg-gradient-to-r from-accent/20 to-accent/10 hover:from-accent/30 hover:to-accent/20 transition-all duration-300 border-2 border-accent/40 hover:border-accent/60 hover:shadow-xl"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-lg flex-shrink-0">
                    <Globe className="w-7 h-7 text-accent-foreground" />
                  </div>
                  <div>
                    <span className="text-foreground font-bold text-lg block mb-1">
                      Site Master DAEB
                    </span>
                    <span className="text-sm text-muted-foreground">
                      masterdaeb-tanger.ma
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Modern Footer */}
          <div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 px-8 py-6 border-t border-primary/10">
            <p className="text-center text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Université Abdelmalek Essaâdi</span>
              <span className="mx-2">•</span>
              Faculté des Sciences Juridiques, Économiques et Sociales - Tanger
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;