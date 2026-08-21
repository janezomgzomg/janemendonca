import type { MusicData } from './Music.types'
import './Music.css'

export default function Music({ data }: { data: unknown }) {
  const { heading, photos, links, venues } = data as MusicData

  return (
    <section>
      <h1 className="text-3xl font-semibold">{heading}</h1>

      <div className="mt-6">
        <h2 className="text-xl font-medium">Photos</h2>
        {photos.length === 0 ? (
          <p className="mt-2">Coming soon.</p>
        ) : (
          <div className="mt-2 grid grid-cols-3 gap-2">
            {photos.map((photo) => (
              <img key={photo.src} src={photo.src} alt={photo.alt} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-medium">Links</h2>
        {links.length === 0 ? (
          <p className="mt-2">Coming soon.</p>
        ) : (
          <ul className="mt-2 list-disc pl-5">
            {links.map((link) => (
              <li key={link.url}>
                <a href={link.url}>{link.label}</a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-medium">Venues</h2>
        {venues.length === 0 ? (
          <p className="mt-2">Coming soon.</p>
        ) : (
          <ul className="mt-2">
            {venues.map((venue) => (
              <li key={venue.name} className="mt-2">
                <h3 className="font-medium">{venue.name}</h3>
                <ul className="list-disc pl-5">
                  {venue.gigs.map((gig) => (
                    <li key={`${venue.name}-${gig.date}`}>
                      {gig.date} — {gig.bill}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
