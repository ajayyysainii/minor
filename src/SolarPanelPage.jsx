import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import imageUrl from './assets/image.png'

const API_URL = 'https://jellyfish-app-b75d4.ondigitalocean.app/save-json-2'
const FILTER_OPTIONS = [
  { id: 'normal', label: 'Normal', windowMs: 0 },
  { id: '15m', label: '15 min', windowMs: 15 * 60 * 1000 },
  { id: '30m', label: '30 min', windowMs: 30 * 60 * 1000 },
  { id: '1h', label: '1 hour', windowMs: 60 * 60 * 1000 },
]

function SolarPanelPage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [selectedFilter, setSelectedFilter] = useState('normal')

  const fetchSolarPanelData = async () => {
    try {
      const response = await fetch(API_URL)
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const result = await response.json()
      if (!result.success || !Array.isArray(result.data)) {
        throw new Error('Invalid response format')
      }

      setRows(result.data)
      setError(null)
      setLastUpdated(new Date())
    } catch (err) {
      setError(`Error fetching solar panel data: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSolarPanelData()

    const intervalId = setInterval(() => {
      fetchSolarPanelData()
    }, 5000)

    return () => clearInterval(intervalId)
  }, [])

  const formatIST = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    })
  }

  const formatMetric = (value, digits = 3) => {
    if (value === null || value === undefined) return '-'
    const num = typeof value === 'number' ? value : Number(value)
    if (Number.isNaN(num)) return '-'
    return num.toFixed(digits)
  }

  const filteredRows = useMemo(() => {
    const sortedRows = [...rows].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )

    const activeFilter = FILTER_OPTIONS.find((option) => option.id === selectedFilter)
    if (!activeFilter || activeFilter.windowMs === 0) {
      return sortedRows
    }

    const rowsWithTime = sortedRows
      .map((row) => ({
        row,
        timestamp: new Date(row.createdAt).getTime(),
      }))
      .filter((entry) => !Number.isNaN(entry.timestamp))

    if (rowsWithTime.length === 0) {
      return []
    }

    // Use the latest telemetry reading as the filter reference point.
    const referenceTime = rowsWithTime[0].timestamp
    const cutoffTime = referenceTime - activeFilter.windowMs

    return rowsWithTime
      .filter((entry) => entry.timestamp >= cutoffTime)
      .map((entry) => entry.row)
  }, [rows, selectedFilter])

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4 md:p-6 lg:p-8">
      <div className="max-w-md mx-auto lg:max-w-4xl xl:max-w-6xl">
        <div className="mb-8 text-center">
          <div className="text-white text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight">
            Solar Panel Data
          </div>
          <div className="text-gray-400 text-sm md:text-base mt-1">
            Live readings (auto-refresh every 5 seconds)
          </div>
        </div>

        <div className="w-full flex justify-center">
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl inline-flex justify-center items-center gap-1 p-1 border border-gray-700/30 shadow-2xl mb-6">
          <Link
            to="/"
            className="pl-3 pr-4 md:pr-6 py-2 rounded-xl flex justify-center items-center text-gray-300 text-sm md:text-base lg:text-lg font-normal hover:bg-white/5 transition-all duration-200"
          >
            Cleaner
          </Link>
          <div className="px-4 md:px-6 py-2 bg-white/10 backdrop-blur-sm rounded-xl shadow-lg flex justify-center items-center">
            <div className="text-white text-sm md:text-base lg:text-lg font-medium">Solar Panel</div>
          </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:gap-8 w-full">
          <div className="relative w-full max-w-sm md:max-w-md lg:max-w-lg mx-auto">
            <img
              className="w-full h-auto rounded-2xl shadow-2xl border border-gray-700/20"
              src={imageUrl}
              alt="Solar Panel"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
          </div>

          <div className="w-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-4 md:p-6 text-center">
            <div className="flex flex-col gap-2 mb-4 items-center">
              <div className="text-white text-lg font-semibold">Telemetry Table</div>
              <div className="text-gray-400 text-sm">
                {lastUpdated
                  ? `Last updated: ${lastUpdated.toLocaleTimeString('en-IN', {
                      timeZone: 'Asia/Kolkata',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: true,
                    })} IST`
                  : 'Waiting for first update...'}
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mb-4 w-full">
              {FILTER_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedFilter(option.id)}
                  className={`px-3 py-1.5 rounded-lg border text-sm transition-all duration-200 ${
                    selectedFilter === option.id
                      ? 'bg-blue-500/20 border-blue-400/50 text-blue-300'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="text-gray-400 text-sm">Loading solar panel data...</div>
            ) : error ? (
              <div className="text-red-400 text-sm">{error}</div>
            ) : filteredRows.length === 0 ? (
              <div className="text-gray-400 text-sm">No data available.</div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent shadow-inner">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-3 px-3 text-gray-300 text-sm font-semibold text-center bg-black/10">
                        Time (IST)
                      </th>
                      <th className="py-3 px-3 text-gray-300 text-sm font-semibold text-center bg-black/10">
                        Voltage
                      </th>
                      <th className="py-3 px-3 text-gray-300 text-sm font-semibold text-center bg-black/10">
                        Current
                      </th>
                      <th className="py-3 px-3 text-gray-300 text-sm font-semibold text-center bg-black/10">
                        Power
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map((item, idx) => {
                      const voltage = item.data?.voltage
                      const current = item.data?.current
                      const power = item.data?.power

                      const currentNum = typeof current === 'number' ? current : Number(current)
                      const isCurrentPositive = !Number.isNaN(currentNum) ? currentNum >= 0 : true

                      return (
                        <tr
                          key={item._id}
                          className={`border-b border-white/5 transition-colors ${
                            idx % 2 === 0 ? 'bg-white/0' : 'bg-white/3'
                          } hover:bg-white/7`}
                        >
                          <td className="py-3 px-3 text-white/90 text-sm whitespace-nowrap text-center">
                            {formatIST(item.createdAt)}
                          </td>

                          <td className="py-3 px-3 text-center">
                            <span className="inline-flex items-center justify-center px-2 py-1 rounded-full border border-white/10 bg-white/5 text-white text-xs">
                              {voltage === null || voltage === undefined
                                ? '-'
                                : `${formatMetric(voltage, 2)} V`}
                            </span>
                          </td>

                          <td className="py-3 px-3 text-center">
                            <span
                              className={`inline-flex items-center justify-center px-2 py-1 rounded-full border text-xs ${
                                isCurrentPositive
                                  ? 'border-green-400/30 bg-green-500/15 text-green-300'
                                  : 'border-red-400/30 bg-red-500/15 text-red-300'
                              }`}
                            >
                              {current === null || current === undefined
                                ? '-'
                                : `${formatMetric(current, 3)} A`}
                            </span>
                          </td>

                          <td className="py-3 px-3 text-center">
                            <span className="inline-flex items-center justify-center px-2 py-1 rounded-full border border-white/10 bg-white/5 text-white text-xs">
                              {power === null || power === undefined ? '-' : `${formatMetric(power, 2)} W`}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SolarPanelPage
