import { Button } from '../components/ui/button';

export default function Pricing() {
  return (
    <div className="py-10">
      <h2 className="text-center text-4xl">Pricing</h2>
      <div className="mt-10 flex items-start justify-between rounded-lg border border-border p-6">
        <div className="w-full">
          <h3>Starter Plan</h3>
          <div className="grid grid-cols-2 gap-2">
            <ul className="space-y-1">
              <li>1 Server</li>
              <li>Unlimited Sites</li>
              <li>Unlimited Deployments</li>
            </ul>
            <ul className="space-y-1">
              <li>Unlimited Databases</li>
              <li>Server Monitoring</li>
              <li>Zero Downtime Deployment</li>
            </ul>
          </div>
        </div>
        <div className="flex h-full min-w-[170px] flex-col justify-between gap-6 text-center">
          <div className="flex flex-col gap-2">
            <span className="text-5xl font-bold">€1</span>
            <span className="text-md text-muted-foreground">per month</span>
          </div>
          <Button disabled>Coming Soon</Button>
        </div>
      </div>
    </div>
  );
}
