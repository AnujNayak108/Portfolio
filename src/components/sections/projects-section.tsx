import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PROJECTS_DATA } from '@/lib/constants';
import type { Project } from '@/types';
import { ExternalLink, Github, Rocket } from 'lucide-react';

export function ProjectsSection() {
  return (
    <section id="projects" className="w-full section-padding">
      <div className="container mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 flex items-center justify-center">
          <Rocket className="h-10 w-10 text-primary mr-3" />
          Featured Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROJECTS_DATA.map((project: Project) => (
            <Card key={project.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-primary/50 transition-shadow duration-300 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <div className="aspect-video relative">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                    data-ai-hint={project.dataAiHint}
                  />
                </div>
                <CardTitle className="mt-4 text-2xl">{project.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-muted-foreground mb-4">{project.description}</CardDescription>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-primary/20 text-primary-foreground hover:bg-primary/30">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-start gap-4 pt-4">
                {project.liveLink && (
                  <Button asChild variant="outline" className="border-accent text-accent hover:bg-accent/10 hover:text-accent">
                    <Link href={project.liveLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                    </Link>
                  </Button>
                )}
                {project.repoLink && (
                  <Button asChild variant="ghost" className="text-muted-foreground hover:text-accent">
                    <Link href={project.repoLink} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" /> Source Code
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
