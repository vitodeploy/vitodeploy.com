import {BorderBeam} from "@site/src/components/magicui/border-beam";
import {WordRotate} from "@site/src/components/magicui/word-rotate";
import {Button} from "@site/src/components/ui/button";
import {BookOpenIcon, PlayIcon} from "lucide-react";
import {JSX} from "react";

export default function Header(): JSX.Element {
    return (
        <header className='container relative flex flex-col items-center justify-center'>
            <h1 className='font-bold text-[60px] text-indigo-600 dark:text-white mb-2'>VitoDeploy</h1>
            <WordRotate
                className='text-3xl font-semibold mb-0'
                words={["Open-Source", "Free", "Self-Hosted"]}
            />
            <p className='text-3xl mb-2'>Server Management Tool</p>
            <div
                className="relative overflow-hidden rounded-[9px] border border-border mt-10 shadow-lg bg-[url(/img/services-light.png)] dark:bg-[url(/img/services-dark.png)] bg-cover bg-center">
                <img src="/img/services-light.png" alt="VitoDeploy" className="max-h-[500px] opacity-0"/>
                <BorderBeam size={200}/>
            </div>
            <div className="flex items-center mt-10 gap-2">
                <Button size="lg" onClick={() => window.location.href = "/docs/getting-started/introduction"}>
                    <BookOpenIcon className="!size-5"/>
                    Documentation
                </Button>
                <Button size="lg" variant="secondary"
                        onClick={() => window.open("https://demo.vitodeploy.com", "_blank")}>
                    <PlayIcon className="!size-5"/>
                    Live Demo
                </Button>
            </div>
        </header>
    );
}