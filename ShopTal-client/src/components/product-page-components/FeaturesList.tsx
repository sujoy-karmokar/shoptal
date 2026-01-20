import { CheckCircle } from "lucide-react";

interface Feature {
  name: string;
  value: string;
}

interface FeaturesListProps {
  features: Feature[];
}

export const FeaturesList = ({ features }: FeaturesListProps) => {
  if (!features || features.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="font-semibold text-lg mb-4">Key Features</h3>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <span className="text-muted-foreground">
              <span className="font-medium text-foreground">
                {feature.name}:
              </span>{" "}
              {feature.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
