import { MessageCircleIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { Marquee } from './magicui/marquee';
import { Button } from './ui/button';

const reviews = [
  {
    name: 'Mahdi',
    username: '@hazaveh',
    body: 'Did you know VitoDeploy is the perfect open source alternative of Laravel Forge?',
    img: '/img/testimonial/hazaveh.jpg',
    url: 'https://x.com/hazaveh/status/1706986832192291322',
  },
  {
    name: 'Nader Ikladious',
    username: '@NaderIkladious',
    body: 'Gotta say using #VitoDeploy to manage server and deployments was indeed the best decision while working on #spur',
    img: '/img/testimonial/NaderIkladious.jpg',
    url: 'https://x.com/naderikladious/status/1783878659595460945?s=46&t=-NaW6qm2Kqm7A2SOuX8w5A',
  },
  {
    name: 'Marcelo Anjos',
    username: '@geek_marcelo',
    body: 'Deploying with Vito Deploy is a game-changer! 🚀 Fast, reliable, and hassle-free—exactly what every developer needs. Highly recommended! #VitoDeploy',
    img: '/img/testimonial/geek_marcelo.jpg',
    url: 'https://x.com/geek_marcelo/status/1904107374819922190',
  },
  {
    name: 'Jorge',
    username: '@heyjorgedev',
    body: 'VitoDeploy is one of the few projects I’m really excited about. And it’s built with @laravelphp and @htmx_org',
    img: '/img/testimonial/heyjorgedev.jpg',
    url: 'https://x.com/heyjorgedev/status/1834949411899600924',
  },
  {
    name: 'Mason',
    username: '@capten_masin',
    body: 'Never heard if VitoDeploy until today, this looks amazing',
    img: '/img/testimonial/capten_masin.jpg',
    url: 'https://x.com/capten_masin/status/1803067560520278527',
  },
  {
    name: 'Arun Joseph',
    username: '@thenexido',
    body: 'Never heard about vitodeploy before and it looks interesting.',
    img: '/img/testimonial/thenexido.jpg',
    url: 'https://x.com/thenexido/status/1803101943650533795',
  },
  {
    name: 'Bernard Sarfo Twumasi',
    username: '@devsarfo',
    body: 'After using VitoDeploy by @saeed_vz for a month, I highly recommend it to all PHP developers, especially those using Laravel. It makes server management and PHP application deployment to production servers simple and hassle-free.',
    img: '/img/testimonial/devsarfo.jpg',
    url: 'https://x.com/devsarfo/status/1747629642893144509',
  },
  {
    name: 'Muhammad Shafeeq',
    username: '@hmshafeeq',
    body: 'Recently tried VitoDeploy, impressed by its features, performance and versatility. Hats off to you for building such a powerful deployment solution and making it open sourced  :)',
    img: '/img/testimonial/hmshafeeq.jpg',
    url: 'https://x.com/hmshafeeq/status/1841098713546039648',
  },
  {
    name: 'Wilson Bridgett',
    username: '@_wilsonpb',
    body: 'Just discovered #vitodeploy and have become a fan. I also like the change to SQLite! Is the 1.x branch in a good place to give it a beta test run. Thx for your work on this project',
    img: '/img/testimonial/_wilsonpb.jpg',
    url: 'https://x.com/_wilsonpb/status/1765912692223594565',
  },
  {
    name: 'James Kokou GAGLO',
    username: '@dzamsgaglo',
    body: 'Vito is a self-hosted web application that helps you manage your servers and deploy your PHP applications into production servers without a hassle.',
    img: '/img/testimonial/dzamsgaglo.jpg',
    url: 'https://x.com/dzamsgaglo/status/1838577721305071878',
  },
];

const firstRow = reviews.slice(0, reviews.length / 3);
const secondRow = reviews.slice(reviews.length / 3, (reviews.length * 2) / 3);
const thirdRow = reviews.slice((reviews.length * 2) / 3, reviews.length);

const ReviewCard = ({ img, name, username, body, url }: { img: string; name: string; username: string; body: string; url: string }) => {
  return (
    <div
      onClick={() => {
        window.open(url, '_blank');
      }}
      className={cn(
        'relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4',
        'border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]',
        'dark:border-gray-800/50 dark:bg-gray-900/80 dark:hover:bg-gray-900/50',
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <div className="text-md font-medium dark:text-white">{name}</div>
          <p className="mb-0 text-sm font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <div className="text-md mt-2">{body}</div>
    </div>
  );
};

export function Testimonial() {
  return (
    <div className="py-10">
      <h2 className="text-center text-4xl">Join the community</h2>
      <p className="text-center text-lg text-gray-700 dark:text-gray-400">
        Discover what the community has to say about their VitoDeploy experience.
      </p>
      <div className="flex items-center justify-center gap-2 py-4">
        <Button variant="outline" onClick={() => window.open('https://github.com/vitodeploy/vito/discussions')}>
          <MessageCircleIcon className="size-4" />
          Github Discussions
        </Button>
        <Button variant="outline" onClick={() => window.open('https://discord.gg/uZeeHZZnm5')}>
          <MessageCircleIcon className="size-4" />
          Discord
        </Button>
      </div>
      <div className="relative mt-5 flex w-full flex-col items-center justify-center overflow-hidden">
        <Marquee pauseOnHover className="[--duration:20s]">
          {firstRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:20s]">
          {secondRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        <Marquee pauseOnHover className="[--duration:20s]">
          {thirdRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
      </div>
    </div>
  );
}
