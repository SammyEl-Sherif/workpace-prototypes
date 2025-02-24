import { useFetch } from '@/hooks'
import { ProjectsRecord } from '@/pocketbase-types'

export const useProjects = (mock: boolean) => {
  // const [projects, isLoading, error, _, handleMakeRequest] = useFetch<ProjectsRecord[], null>(
  //   'pocketbase/collections/projects',
  //   { manual: true },
  //   null
  // )
  return [
    [
      {
        description:
          'This prototype enables me to create valuable artifacts, such as year-end reviews, resume sections, and LinkedIn experience descriptions, based on my accomplishments (task tracking in Notion).',
        id: '1',
        title: 'The Good Stuff List',
        url: '/good-stuff-list',
      },
      {
        description:
          'This is a placeholder prototype. This links to the good stuff list prototype for now.',
        id: '2',
        title: 'Prototype 1',
        url: '/good-stuff-list',
      },
      {
        description:
          'This is a placeholder prototype. This links to the good stuff list prototype for now.',
        id: '3',
        title: 'Prototype 2',
        url: '/good-stuff-list',
      },
      {
        description:
          'This is a placeholder prototype. This links to the good stuff list prototype for now.',
        id: '4',
        title: 'Prototype 3',
        url: '/good-stuff-list',
      },
    ] as ProjectsRecord[],
    false,
    false,
  ] as const

  // return [projects ?? null, isLoading, error] as const
}
