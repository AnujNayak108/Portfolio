import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EDUCATION_DATA } from '@/lib/constants';
import type { EducationEntry } from '@/types';
import { School, CalendarDays } from 'lucide-react';

export function EducationSection() {
  return (
    <section id="education" className="w-full section-padding">
      <div className="container mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 flex items-center justify-center">
          <School className="h-10 w-10 text-primary mr-3" />
          Education
        </h2>
        <div className="space-y-8 max-w-3xl mx-auto">
          {EDUCATION_DATA.map((entry: EducationEntry) => (
            <Card key={entry.id} className="shadow-lg hover:shadow-primary/40 transition-shadow duration-300 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">{entry.institution}</CardTitle>
                <p className="text-lg text-accent">{entry.degree}</p>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  <span>{entry.period}</span>
                </div>
              </CardHeader>
              {entry.description && (
                <CardContent>
                  <CardDescription>{entry.description}</CardDescription>
                </CardContent>
              )}
              {entry.Achiements && (
                <CardContent>
                  <CardDescription>{entry.Achiements}</CardDescription>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
