import { FiAward, FiHeart, FiTarget, FiUsers } from 'react-icons/fi'

import ScrollReveal from '../components/ScrollReveal'
import SmartImage from '../components/SmartImage'

const TEAM = [
  {
    name: 'Meera Krishnan',
    role: 'Founder & Lead Planner',
    image: '/images/about/team.svg',
    bio: 'Fifteen years planning weddings across South India.',
  },
  {
    name: 'Arjun Mehta',
    role: 'Head of Corporate Events',
    image: '/images/about/story.svg',
    bio: 'Runs conferences and kickoffs for teams of 500 and up.',
  },
  {
    name: 'Divya Nair',
    role: 'Creative & Design Lead',
    image: '/images/about/mission.svg',
    bio: 'Designs the decor, stage and print for every booking.',
  },
  {
    name: 'Sameer Rao',
    role: 'Operations Manager',
    image: '/images/gallery/keynote.svg',
    bio: 'Keeps vendors, timings and logistics on schedule.',
  },
]

const MILESTONES = [
  { year: '2017', title: 'The first booking', text: 'A 120-guest wedding in Bengaluru that started it all.' },
  { year: '2019', title: 'Corporate division', text: 'Added conferences and annual kickoffs to the mix.' },
  { year: '2022', title: 'Twelve cities', text: 'Expanded our vendor network across India.' },
  { year: '2026', title: '480 events', text: 'And a team of twenty-two planning them together.' },
]

const VALUES = [
  { Icon: FiHeart, title: 'Our mission', text: 'Make planning an event feel simple, warm and genuinely enjoyable.' },
  { Icon: FiTarget, title: 'Our vision', text: 'Become the team people call first across India.' },
  { Icon: FiUsers, title: 'Our approach', text: 'One point of contact, honest quotes, and a run-sheet we follow.' },
]

export default function About() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Who we are</p>
          <h1>About EventNest</h1>
          <p className="page-hero-lede">
            A small team of planners who have spent nine years making sure the
            day goes exactly as you imagined it.
          </p>
        </div>
      </section>

      <section className="section-sm">
        <div className="container story">
          <div className="story-text">
            <p className="eyebrow">Our story</p>
            <h2>It started with one wedding</h2>
            <p className="text-muted">
              In 2017 we took on a single 120-guest wedding. Nothing was automated
              and nothing was templated. What we learned was that people remember
              the details, not the decorations: whether the food arrived hot,
              whether their parents had chairs, whether anyone noticed they were
              tired.
            </p>
            <p className="text-muted">
              We built our process around that. One planner owns your booking end
              to end, the quote is fixed, and we run a written schedule on the day.
              That is still how we work.
            </p>
          </div>

          <div className="story-media">
            <SmartImage
              src="/images/about/story.svg"
              alt="Our studio"
              ratio="4 / 3"
              className="story-image"
              eager
            />
          </div>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          <div className="value-grid">
            {VALUES.map(({ Icon, title, text }, index) => (
              <ScrollReveal key={title} delay={index * 0.08}>
                <article className="card value-card">
                  <span className="value-icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <h3>{title}</h3>
                  <p className="text-muted">{text}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          <ScrollReveal>
            <div className="section-head section-head-center">
              <p className="eyebrow">The team</p>
              <h2>Who you will be working with</h2>
              <p>A dedicated planner looks after your booking from the first call
                to the final teardown.</p>
            </div>
          </ScrollReveal>

          <div className="team-grid">
            {TEAM.map((person, index) => (
              <ScrollReveal key={person.name} delay={index * 0.07}>
                <article className="card card-hover team-card">
                  <SmartImage
                    src={person.image}
                    alt={person.name}
                    ratio="1 / 1"
                    className="team-card-image"
                  />
                  <div className="team-card-body">
                    <h3>{person.name}</h3>
                    <p className="team-card-role">{person.role}</p>
                    <p className="text-muted text-sm">{person.bio}</p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          <ScrollReveal>
            <div className="section-head section-head-center">
              <p className="eyebrow">Milestones</p>
              <h2>How we got here</h2>
            </div>
          </ScrollReveal>

          <ol className="timeline">
            {MILESTONES.map((item, index) => (
              <ScrollReveal
                as="li"
                key={item.year}
                delay={index * 0.09}
                className="timeline-item"
              >
                <span className="timeline-year">
                  <FiAward aria-hidden="true" />
                  {item.year}
                </span>
                <h3>{item.title}</h3>
                <p className="text-muted">{item.text}</p>
              </ScrollReveal>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}