import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ContentPage() {
    return (
        <div className="min-h-screen bg-[#FDF6E3] p-8 md:p-16 relative font-serif text-[#4A4036]">
            <div className="max-w-4xl mx-auto bg-yellow-50 shadow-2xl rounded-sm p-8 md:p-12 border-l-8 border-[#D4A017] relative transform rotate-1">
                {/* Paper Texture Overlay */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] pointer-events-none rounded-sm" />

                <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 uppercase tracking-widest decoration-wavy underline decoration-[#D4A017]">
                        Modern Schools
                    </h1>

                    <div className="space-y-6 text-lg md:text-xl leading-relaxed">
                        <p className="first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-[#D4A017]">
                            Modern schools are designed to help each student to be successful.
                            Teachers play the role of a guide for them and prepare them for lifelong learning.
                            They encourage and challenge them to become responsible and confident individuals.
                        </p>

                        <p>
                            Class discussion is a main feature of modern schools. Students are expected to take part in discussions and express personal opinions.
                            It is also important to ask questions in class if students do not understand any point or instruction.
                            Group learning is another common feature. Students may work in small groups on a project task.
                        </p>

                        <p>
                            In class, teachers and students use computers to access digital learning resources.
                            Teachers use technology and audio-visual materials to support their lessons.
                            Outside the classroom, students have a chance to participate in field trips to famous landmarks such as museums, hospitals, and industry locations.
                            These trips give them real-world experiences. Students also attend school camps to make friends with other students and to develop life skills in unfamiliar environments.
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation to Game */}
            <Link
                href="/game"
                className="fixed bottom-8 right-8 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full shadow-lg flex items-center gap-3 text-xl font-bold transition-all hover:scale-105 active:scale-95 group z-50 border-4 border-green-700"
            >
                Start Game <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
    );
}
