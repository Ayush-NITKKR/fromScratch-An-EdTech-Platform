import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Footer from '../components/common/Footer'
import { apiConnector } from '../services/apiconnector'
import { categories } from '../services/api'
import { getCatalogaPageData } from '../services/pageAndComponentData'
import CourseSlider from '../components/catalog/CourseSlider'
import Course_Card from '../components/catalog/Course_Card'

const TABS = [
    { key: 'popular', label: 'Most Popular' },
    { key: 'new', label: 'New' },
]

const Catalog = () => {
    const { catalogName } = useParams()

    const [categoryId, setCategoryId] = useState('')
    const [catalogPageData, setCatalogPageData] = useState(null)
    const [activeTab, setActiveTab] = useState('popular')
    const [status, setStatus] = useState('loading') // loading | ready | not-found | error

    // Step 1: resolve the category slug in the URL to a category id
    useEffect(() => {
        let cancelled = false

        const resolveCategory = async () => {
            setStatus('loading')
            try {
                const res = await apiConnector('GET', categories.CATEGORY_API)
                const match = res?.data?.data?.find(
                    (ct) => ct.name.toLowerCase().replace(/\s+/g, '-') === catalogName
                )

                if (cancelled) return

                if (match) {
                    setCategoryId(match._id)
                } else {
                    console.error('Category not found for name:', catalogName)
                    setStatus('not-found')
                }
            } catch (error) {
                console.error('Error fetching categories:', error)
                if (!cancelled) setStatus('error')
            }
        }

        resolveCategory()
        return () => { cancelled = true }
    }, [catalogName])

    // Step 2: once we have a category id, fetch everything the page needs
    useEffect(() => {
        if (!categoryId) return
        let cancelled = false

        const fetchPageData = async () => {
            try {
                const res = await getCatalogaPageData(categoryId)
                if (cancelled) return
                setCatalogPageData(res)
                setStatus('ready')
            } catch (error) {
                console.error(error)
                if (!cancelled) setStatus('error')
            }
        }

        fetchPageData()
        return () => { cancelled = true }
    }, [categoryId])

    const selectedCategoryData = catalogPageData?.data?.selectedCategory
    const differentCategoryData = catalogPageData?.data?.differentCategory
    const mostSellingCourses = catalogPageData?.data?.mostSellingCourses || []

    const filteredCourses = useMemo(() => {
        const courses = selectedCategoryData?.course || []
        const sorted = [...courses]
        if (activeTab === 'popular') {
            sorted.sort((a, b) => (b.studentEnrolled?.length || 0) - (a.studentEnrolled?.length || 0))
        } else {
            sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        }
        return sorted
    }, [selectedCategoryData, activeTab])

    if (status === 'loading') {
        return <CatalogSkeleton />
    }

    if (status === 'not-found') {
        return (
            <CatalogMessage
                title="We couldn't find that category"
                body={`"${catalogName}" doesn't match anything in our catalog yet.`}
                action={{ to: '/catalog', label: 'Browse all categories' }}
            />
        )
    }

    if (status === 'error') {
        return (
            <CatalogMessage
                title="Something went wrong"
                body="We couldn't load this catalog right now. Please try again in a moment."
                action={{ to: 0, label: 'Reload page', isReload: true }}
            />
        )
    }

    return (
        <div className="min-h-screen bg-[#0A0B10] text-white">
            {/* Hero */}
            <div className="relative overflow-hidden border-b border-white/5 bg-gradient-to-b from-[#141221] to-[#0A0B10] py-12 lg:py-16">
                <div className="pointer-events-none absolute -top-40 right-0 h-[400px] w-[400px] rounded-full bg-[#7C3AED] opacity-10 blur-[150px]" />
                <div className="pointer-events-none absolute -bottom-20 left-1/3 h-[300px] w-[300px] rounded-full bg-[#9333EA] opacity-5 blur-[120px]" />

                <div className="mx-auto flex w-11/12 max-w-maxContent flex-col gap-4">
                    <nav className="flex items-center text-sm font-medium text-gray-400" aria-label="Breadcrumb">
                        <Link to="/" className="transition-colors duration-200 hover:text-white">Home</Link>
                        <span className="mx-2 text-gray-600">/</span>
                        <Link to="/catalog" className="transition-colors duration-200 hover:text-white">Catalog</Link>
                        <span className="mx-2 text-gray-600">/</span>
                        <span className="font-semibold text-[#9333EA]" aria-current="page">
                            {selectedCategoryData?.name}
                        </span>
                    </nav>
                    <h1 className="text-3xl font-bold tracking-tight text-white lg:text-4xl">
                        {selectedCategoryData?.name}
                    </h1>
                    {selectedCategoryData?.description && (
                        <p className="max-w-[800px] text-base leading-relaxed text-gray-300">
                            {selectedCategoryData.description}
                        </p>
                    )}
                </div>
            </div>

            <div className="mx-auto flex w-11/12 max-w-maxContent flex-col gap-16 py-12 lg:py-16">

                {/* Section 1: courses in this category */}
                <section className="flex flex-col gap-6" aria-labelledby="starter-courses-heading">
                    <div className="flex flex-col gap-2">
                        <h2 id="starter-courses-heading" className="text-2xl font-bold lg:text-3xl">
                            Courses to get you started
                        </h2>
                        <div className="flex border-b border-white/10 text-sm font-medium" role="tablist">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.key}
                                    role="tab"
                                    aria-selected={activeTab === tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`relative px-4 py-3 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0B10] ${
                                        activeTab === tab.key ? 'font-semibold text-[#7C3AED]' : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    {tab.label}
                                    {activeTab === tab.key && (
                                        <span className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-[#7C3AED] to-[#9333EA] shadow-[0_0_8px_rgba(124,58,237,0.8)]" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {filteredCourses.length > 0 ? (
                        <CourseSlider Courses={filteredCourses} />
                    ) : (
                        <p className="rounded-xl border border-white/5 bg-white/[0.02] px-6 py-10 text-center text-sm text-gray-400">
                            No courses here yet — check back soon.
                        </p>
                    )}
                </section>

                {/* Section 2: related category */}
                {differentCategoryData?.course?.length > 0 && (
                    <section className="flex flex-col gap-6" aria-labelledby="related-courses-heading">
                        <div className="flex flex-col gap-1">
                            <h2 id="related-courses-heading" className="text-2xl font-bold lg:text-3xl">
                                Top Courses in <span className="text-[#9333EA]">{differentCategoryData?.name}</span>
                            </h2>
                            <p className="text-sm text-gray-400">Discover recommended tracks from other popular domains.</p>
                        </div>
                        <CourseSlider Courses={differentCategoryData?.course} />
                    </section>
                )}

                {/* Section 3: frequently bought */}
                {mostSellingCourses.length > 0 && (
                    <section className="flex flex-col gap-6" aria-labelledby="frequently-bought-heading">
                        <div className="flex flex-col gap-1">
                            <h2 id="frequently-bought-heading" className="text-2xl font-bold lg:text-3xl">
                                Frequently Bought Together
                            </h2>
                            <p className="text-sm text-gray-400">Curated high-demand classes trending right now.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-6 py-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {mostSellingCourses.slice(0, 4).map((course, index) => (
                                <div
                                    key={course._id || index}
                                    className="transition-transform duration-300 hover:scale-[1.02]"
                                >
                                    <Course_Card course={course} Height="h-[200px]" />
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            <Footer />
        </div>
    )
}

// --- Loading skeleton, matches the hero + card grid shape instead of a blank spinner screen ---
const CatalogSkeleton = () => (
    <div className="min-h-screen animate-pulse bg-[#0A0B10] text-white">
        <div className="border-b border-white/5 bg-gradient-to-b from-[#141221] to-[#0A0B10] py-12 lg:py-16">
            <div className="mx-auto flex w-11/12 max-w-maxContent flex-col gap-4">
                <div className="h-4 w-40 rounded bg-white/10" />
                <div className="h-9 w-64 rounded bg-white/10" />
                <div className="h-4 w-full max-w-[500px] rounded bg-white/5" />
            </div>
        </div>
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col gap-8 py-12">
            <div className="h-7 w-72 rounded bg-white/10" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-[220px] rounded-xl bg-white/5" />
                ))}
            </div>
        </div>
    </div>
)

// --- Shared empty/error state ---
const CatalogMessage = ({ title, body, action }) => (
    <div className="grid min-h-[calc(100vh-10rem)] place-items-center bg-[#0A0B10] px-6 text-white">
        <div className="flex max-w-md flex-col items-center gap-3 text-center">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-gray-400">{body}</p>
            {action?.isReload ? (
                <button
                    onClick={() => window.location.reload()}
                    className="mt-2 rounded-xl bg-[#7C3AED] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#6D28D9]"
                >
                    {action.label}
                </button>
            ) : (
                <Link
                    to={action.to}
                    className="mt-2 rounded-xl bg-[#7C3AED] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#6D28D9]"
                >
                    {action.label}
                </Link>
            )}
        </div>
    </div>
)

export default Catalog 