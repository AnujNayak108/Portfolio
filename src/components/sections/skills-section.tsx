
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SKILLS_DATA } from '@/lib/constants';
import type { Skill, SkillCategory } from '@/types';
import { Brain, Code2, Laptop } from 'lucide-react'; // Added Code2 and Laptop for category icons

export function SkillsSection() {
  const webDevSkills = SKILLS_DATA.filter(skill => skill.category === 'Web Development');
  const dataScienceSkills = SKILLS_DATA.filter(skill => skill.category === 'Data Science & AI');
  const programming = SKILLS_DATA.filter(skill => skill.category === 'programming');

  const renderSkillBadge = (skill: Skill) => (
    <Badge
      key={skill.name}
      variant="secondary"
      className="text-base sm:text-lg px-4 py-2 sm:px-5 sm:py-2.5 rounded-full hover:bg-primary/30 motion-safe:hover:scale-105"
    >
      {skill.icon && (
        <skill.icon className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
      )}
      <span className="whitespace-nowrap">{skill.name}</span>
    </Badge>
  );

  return (
    <section id="skills" className="w-full section-padding bg-background">
      <div className="container mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 flex items-center justify-center">
          <Brain className="h-10 w-10 text-primary mr-3" />
          Skills & Expertise
        </h2>
        
        <div className="grid grid-cols-1 items-center justify-center gap-10 max-w-5xl mx-auto">
          <Card className="shadow-xl bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl sm:text-3xl text-primary flex items-center justify-center">
                <Laptop className="mr-3 h-7 w-7" />
                Web Development
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                {webDevSkills.map(renderSkillBadge)}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl sm:text-3xl text-primary flex items-center justify-center">
                <Code2 className="mr-3 h-7 w-7" />
                Data Science & AI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                {dataScienceSkills.map(renderSkillBadge)}
              </div>
            </CardContent>
          </Card>


          <Card className="shadow-xl bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl sm:text-3xl text-primary flex items-center justify-center">
                <Code2 className="mr-3 h-7 w-7" />
                Programming Languages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                {programming.map(renderSkillBadge)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
