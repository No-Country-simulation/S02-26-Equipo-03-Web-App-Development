import { Card, CardContent } from "../ui/card";

interface BenefitsSectionCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;  
    visualization: React.ReactNode;
}

export default function BenefitsSectionCard({ title, description, icon, visualization }: BenefitsSectionCardProps){
    return (
      <Card className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <CardContent className="p-4 flex flex-col items-center text-center h-full">
                <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 mr-4 mb-2">
                        {icon}
                    </div>
                <div className="flex items-center mb-4">
                    
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">{description}</p>
                <div className="w-full mt-4">
                    {visualization}
                </div>
                    <div className="mt-6 text-sm font-medium text-emerald-600">
      Setup: &lt; 1 min
    </div>
            </CardContent>
      </Card>
    )
}