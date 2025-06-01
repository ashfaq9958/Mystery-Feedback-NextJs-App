"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

import messages from "@/messages.json";
import {
  ArrowRight,
  Mail,
  MessageSquare,
  Shield,
  Star,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: Shield,
      title: "100% Anonymous",
      description:
        "Your identity is completely protected. Share feedback without fear.",
    },
    {
      icon: MessageSquare,
      title: "Real Feedback",
      description:
        "Get honest, constructive feedback that drives real improvement.",
    },
    {
      icon: Users,
      title: "Better Teams",
      description:
        "Build stronger, more communicative teams through open dialogue.",
    },
  ];

  return (
    <>
      {/* Main content */}
      <main className="min-h-screen bg-gray-900 text-white px-4 md:px-24 py-16 mt-16 flex flex-col">
        <section
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="inline-flex items-center px-4 py-2 bg-gray-900 border border-gray-700 rounded-full mb-6">
            <Star className="h-4 w-4 text-white mr-2" />
            <span className="text-sm text-gray-300">
              Trusted by 10,000+ teams worldwide
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Dive into the World of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
              Anonymous Feedback
            </span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-400">
            True Feedback — Where your identity remains a secret.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-gray-200 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Start Collecting Feedback
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white text-black hover:bg-white hover:text-black px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
            >
              Watch Demo
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full max-w-6xl mx-auto mb-16">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-gray-900 backdrop-blur-lg border border-gray-800 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105"
              >
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-6">
                    <feature.icon className="h-8 w-8 text-black" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Testimonials Carousel */}

        <section className="w-full max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What People Are Saying
            </h2>
            <p className="text-gray-400 text-lg">
              Real feedback from real users (anonymously, of course)
            </p>
          </div>

          <Carousel
            plugins={[Autoplay({ delay: 4000 })]}
            className="w-full"
            aria-label="User Feedback Carousel"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-4">
                  <Card className="bg-gray-900 backdrop-blur-lg text-white border border-gray-800 shadow-2xl rounded-2xl hover:bg-gray-800 transition-all duration-300">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl md:text-2xl text-white font-semibold">
                          {message.title}
                        </CardTitle>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 text-white fill-current"
                            />
                          ))}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-start gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                          <Mail className="h-6 w-6 text-black" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-lg leading-relaxed text-gray-300 mb-4">
                          "{message.content}"
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-white font-medium">
                            Anonymous User
                          </p>
                          <p className="text-xs text-gray-500">
                            {message.received}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="flex justify-center mt-8 gap-4">
              <CarouselPrevious className="bg-gray-900 backdrop-blur-lg border-gray-800 hover:bg-white hover:border-white hover:text-black text-white transition-all duration-300 w-12 h-12" />
              <CarouselNext className="bg-gray-900 backdrop-blur-lg border-gray-800 hover:bg-white hover:border-white hover:text-black text-white transition-all duration-300 w-12 h-12" />
            </div>
          </Carousel>
        </section>

        {/* CTA Section */}
        <section className="mt-20 text-center">
          <div className="bg-gray-900 backdrop-blur-lg border border-gray-800 rounded-3xl p-12 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Feedback Culture?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of teams who've discovered the power of anonymous
              feedback. Start building better communication today.
            </p>
            <Button
              size="lg"
              className="bg-white text-black hover:bg-gray-200 px-12 py-4 text-lg font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Get Started for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>
      <footer className="relative z-10 text-center p-8 bg-gray-900 backdrop-blur-lg text-gray-500 text-sm border-t border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Shield className="h-6 w-6 text-white" />
            <span className="text-lg font-semibold text-white">
              True Feedback
            </span>
          </div>
          <p>
            © {new Date().getFullYear()} True Feedback. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Support
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default HomePage;
