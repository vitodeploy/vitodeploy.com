import { MagicCard } from "@site/src/components/magicui/magic-card";
import { ChartPieIcon, ClockIcon, CogIcon, CpuIcon, DatabaseIcon, FlameIcon, GlobeIcon, KeyIcon, LockIcon, Package2Icon, ServerIcon, TerminalIcon } from "lucide-react";
import { ReactNode } from "react";

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: ReactNode }) {
    return (
        <MagicCard className="rounded-lg p-5" gradientColor="#89898940" gradientFrom="#9E7AFF" gradientTo="#4F45E5">
            <div>
                <div className="text-gray-500">{icon}</div>
                <h2 className="text-xl text-gray-700 dark:text-gray-200 mt-2">{title}</h2>
                <p className="text-gray-500 mb-0">{description}</p>
            </div>
        </MagicCard>
    );
}

export default function Features(): ReactNode {
    return (
        <div className="py-10">
            <h2 className="text-4xl text-center">Features</h2>
            <p className="text-lg text-center text-gray-700 dark:text-gray-400">Explore some of Vito's features</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
                <FeatureCard
                    title="Server"
                    description="Provisions and Manages the server"
                    icon={<ServerIcon size={32} />}
                />
                <FeatureCard
                    title="Database"
                    description="Easy database management, Supports Mysql and MariaDB and PostgreSQL"
                    icon={<DatabaseIcon size={32} />}
                />
                <FeatureCard
                    title="Site"
                    description="Deploy your PHP applications such as Laravel, Wordpress and more"
                    icon={<GlobeIcon size={32} />}
                />
                <FeatureCard
                    title="Firewall"
                    description="Manage your server's firewall"
                    icon={<FlameIcon size={32} />}
                />
                <FeatureCard
                    title="SSL"
                    description="Supports Custom and Letsencrypt SSL"
                    icon={<LockIcon size={32} />}
                />
                <FeatureCard
                    title="Worker"
                    description="Run workers in the background"
                    icon={<CpuIcon size={32} />}
                />
                <FeatureCard
                    title="Services"
                    description="Manages server's services"
                    icon={<CogIcon size={32} />}
                />
                <FeatureCard
                    title="SSH Keys"
                    description="Deploy your SSH Keys to the server"
                    icon={<KeyIcon size={32} />}
                />
                <FeatureCard
                    title="Cron Jobs"
                    description="Create and Manage cron jobs on the server"
                    icon={<ClockIcon size={32} />}
                />
                <FeatureCard
                    title="Headless Console"
                    description="Run ssh commands on your server and see the result right away"
                    icon={<TerminalIcon size={32} />}
                />
                <FeatureCard
                    title="Monitoring"
                    description="Monitor your servers' resource usages like CPU Load, Memory and Disk"
                    icon={<ChartPieIcon size={32} />}
                />
                <FeatureCard
                    title="Projects"
                    description="Manage different projects and invite users to manage the servers"
                    icon={<Package2Icon size={32} />}
                />
            </div>
        </div>
    )
}