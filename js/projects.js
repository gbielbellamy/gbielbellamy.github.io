/* ==========================================================================
   Project data
   --------------------------------------------------------------------------
   The work grid is rendered from this array, so adding a project means adding
   one object here. The markup never has to change.

   Loaded as a classic script rather than an ES module on purpose: the site is
   then just as happy opened straight from the filesystem as it is served over
   HTTP, with no CORS surprises.

   Field reference:
     id       Unique slug, also used as the DOM id.
     title    Project name.
     year     Shown in the card badge.
     role     One line on what the work actually was.
     summary  Two or three sentences. What it does and what was hard.
     tags     Technologies, in the order they matter.
     image    Path to the screenshot, relative to the site root.
     alt      Real alt text describing the screenshot.
     links    Array of { label, href, variant }. variant maps to a button class.
   ========================================================================== */

const PROJECTS = [
  {
    id: 'diamond-lab',
    title: 'Diamond Lab, UC Berkeley',
    year: 'Nov 2024 to present',
    role: 'Sole developer, brief to deployment',
    summary:
      'A live site for a genomics research lab at UC Berkeley, twelve pages covering research areas, publications, team profiles and news. I worked directly with the lab\'s principal investigator through iterative reviews, and it scores 100 on Lighthouse for accessibility, best practices and SEO. I still maintain the code, and the lab manager updates content alongside me.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Netlify', 'Accessibility'],
    image: 'assets/diamond-lab-team.jpg',
    alt: 'The Diamond Lab team page, showing a grid of researcher profiles.',
    links: [
      { label: 'Live site', href: 'https://diamondlab.bio/', variant: 'outline' },
      {
        label: 'GitHub',
        href: 'https://github.com/lmiloslavich/diamondLab',
        variant: 'outline'
      }
    ]
  },
  {
    id: 'job-tracker',
    title: 'The Application Log',
    year: '2026',
    role: 'Design and build, solo project',
    summary:
      'A job-application tracker with no build step, no dependencies and no backend: open the file and it runs. Tracks status, response rate and follow-ups due, with JSON export and import so the data survives a cleared browser. The interface takes its cues from a paper case file, with typewriter headings and ink-stamp status badges.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    image: 'assets/job-tracker.png',
    alt: 'The Application Log dashboard, listing job applications with status badges and summary statistics.',
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/gbielbellamy/job-tracker',
        variant: 'outline'
      }
    ]
  },
  {
    id: 'dashboard-ui',
    title: 'Dashboard-UI',
    year: '2026',
    role: 'Design system and front-end architecture',
    summary:
      'A SaaS-style productivity dashboard built to work out a reusable component layer (Card, Button, Badge) sitting under charts, task lists and notes. It did its job: the patterns proven here became the foundation Northstar was built on, so the project was retired rather than duplicated.',
    tags: ['React', 'TypeScript', 'Vite', 'Zustand', 'Recharts'],
    image: 'assets/ai-dashboard.png',
    alt: 'Dashboard-UI, showing charts, a task widget and a notes panel.',
    links: [
      {
        label: 'Live demo',
        href: 'https://ai-dashboard-ui-liart.vercel.app',
        variant: 'outline'
      },
      {
        label: 'GitHub',
        href: 'https://github.com/gbielbellamy/dashboard-UI',
        variant: 'outline'
      }
    ]
  },
  {
    id: 'message-generator',
    title: 'Galactic Message Generator',
    year: '2026',
    role: 'Solo project, first thing I wrote for Node',
    summary:
      'A small Node.js command-line tool that composes a random space-themed mission briefing from separate pools of roles, objectives and locations. Deliberately tiny, and the first thing here written to run outside a browser.',
    tags: ['Node.js', 'CLI', 'JavaScript'],
    image: 'assets/my_message.png',
    alt: 'Terminal output from the Galactic Message Generator showing a randomly generated mission briefing.',
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/gbielbellamy/message-generator',
        variant: 'outline'
      }
    ]
  }
];
