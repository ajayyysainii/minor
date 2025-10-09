import './App.css'
import { ChevronRight, RefreshCw } from 'lucide-react'
import imageUrl from './assets/image.png'
import { useState, useEffect } from 'react'

function App() {
  const [solarData, setSolarData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [selectedCleanItem, setSelectedCleanItem] = useState(null)
  const [showDetailPopup, setShowDetailPopup] = useState(false)

  useEffect(() => {
    fetchSolarData()
  }, [])

  const fetchSolarData = async () => {
    try {
      setLoading(true)
      const response = await fetch('https://admin-aarogya-3wmj8.ondigitalocean.app/solar/all')
      const result = await response.json()
      
      if (result.success) {
        setSolarData(result.data)
      } else {
        setError('Failed to fetch solar data')
      }
    } catch (err) {
      setError('Error fetching solar data: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const options = { 
      weekday: 'long', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    }
    return date.toLocaleDateString('en-US', options)
  }

  const handleRefresh = async () => {
    await fetchSolarData()
    setShowSuccessPopup(true)
    setTimeout(() => {
      setShowSuccessPopup(false)
    }, 1000)
  }

  const handleCleanItemClick = (item) => {
    setSelectedCleanItem(item)
    setShowDetailPopup(true)
  }

  const closeDetailPopup = () => {
    setShowDetailPopup(false)
    setSelectedCleanItem(null)
  }



  return (
    <>
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4 md:p-6 lg:p-8">
        <div className="max-w-md mx-auto lg:max-w-4xl xl:max-w-6xl">
          <div className="mb-8">
            <div className="text-white text-xl md:text-2xl lg:text-3xl font-semibold font-['-apple-system',_'BlinkMacSystemFont',_'SF_Pro_Display',_'Helvetica_Neue',_'Segoe_UI',_'Roboto',_'sans-serif'] tracking-tight">Solar Panel Cleaner</div>
            <div className="text-gray-400 text-sm md:text-base font-normal font-['-apple-system',_'BlinkMacSystemFont',_'SF_Pro_Text',_'Helvetica_Neue',_'Segoe_UI',_'Roboto',_'sans-serif'] mt-1">Advanced cleaning system for optimal efficiency</div>
          </div>
          <div className="flex flex-col items-center gap-8 md:gap-12 lg:gap-16">
            <div className="w-full flex flex-col items-center gap-6 md:gap-8 lg:gap-10">
              <div className="w-full flex flex-col items-center gap-6 md:gap-8 lg:gap-10">
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl flex justify-start items-center gap-1 p-1 border border-gray-700/30 shadow-2xl">
                  <div className="px-4 md:px-6 py-2 bg-white/10 backdrop-blur-sm rounded-xl shadow-lg flex justify-center items-center">
                    <div className="text-white text-sm md:text-base lg:text-lg font-medium font-['-apple-system',_'BlinkMacSystemFont',_'SF_Pro_Text',_'Helvetica_Neue',_'Segoe_UI',_'Roboto',_'sans-serif']">Cleaner</div>
                  </div>
                  <div className="pl-3 pr-4 md:pr-6 py-2 rounded-xl flex justify-center items-center hover:bg-white/5 transition-all duration-200">
                    <div className="text-gray-300 text-sm md:text-base lg:text-lg font-normal font-['-apple-system',_'BlinkMacSystemFont',_'SF_Pro_Text',_'Helvetica_Neue',_'Segoe_UI',_'Roboto',_'sans-serif']">Solar Panel</div>
                  </div>
                </div>
                <div className="relative w-full max-w-sm md:max-w-md lg:max-w-lg">
                  <img className="w-full h-auto rounded-2xl shadow-2xl border border-gray-700/20" src={imageUrl} alt="Solar Panel" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                </div>
              </div>
              <div className="w-full flex flex-col items-center gap-4 md:gap-6">
                <div className="flex flex-col items-center gap-4 md:gap-5">
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 backdrop-blur-sm rounded-full border border-green-500/20">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <div className="text-green-400 text-sm md:text-base font-medium font-['-apple-system',_'BlinkMacSystemFont',_'SF_Pro_Text',_'Helvetica_Neue',_'Segoe_UI',_'Roboto',_'sans-serif']">Connected</div>
                  </div>
                  <div className="px-6 md:px-8 py-3 bg-red-500/10 backdrop-blur-sm rounded-2xl border border-red-500/30 shadow-lg hover:bg-red-500/15 transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.5001 0C10.7427 0 10.1251 0.617676 10.1251 1.375V8.25C10.1251 9.00732 10.7427 9.625 11.5001 9.625C12.2574 9.625 12.8751 9.00732 12.8751 8.25V1.375C12.8751 0.617676 12.2574 0 11.5001 0ZM7.18708 2.49756C7.00984 2.51904 6.83796 2.57812 6.6822 2.66943C2.92244 4.84473 1.08015 9.29199 2.20271 13.4922C3.33064 17.687 7.14411 20.6196 11.484 20.625C15.8292 20.6304 19.6534 17.7085 20.7867 13.519C21.9254 9.32422 20.0992 4.87158 16.3448 2.68555C15.6895 2.29883 14.8463 2.51904 14.4649 3.17969C14.2823 3.49121 14.2286 3.86719 14.3199 4.22168C14.4166 4.57617 14.6422 4.87695 14.9591 5.05957C17.65 6.62793 18.9498 9.7915 18.1387 12.7993C17.3223 15.8018 14.6046 17.8804 11.4947 17.875C8.37947 17.8696 5.66706 15.7856 4.8614 12.7778C4.05574 9.77002 5.36091 6.60645 8.0572 5.04883C8.71247 4.66748 8.93806 3.82959 8.55671 3.17432C8.37409 2.85742 8.07868 2.62646 7.72419 2.53516C7.55232 2.48682 7.3697 2.47607 7.18708 2.49756Z" fill="#F04438" />
                      </svg>

                      <div className="text-red-400 text-sm md:text-base font-semibold font-['-apple-system',_'BlinkMacSystemFont',_'SF_Pro_Text',_'Helvetica_Neue',_'Segoe_UI',_'Roboto',_'sans-serif']">Emergency Stop</div>
                    </div>
                  </div>
                </div>
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  <div className="relative w-full p-5 md:p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl hover:bg-white/10 transition-all duration-300 flex flex-col items-center gap-3 overflow-hidden">
                    {/* Green gradient overlay covering bottom half */}
                    <div className="absolute inset-0 bg-gradient-to-t from-green-500/30 via-green-500/15 to-transparent rounded-2xl"></div>
                    
                    <div className="relative z-10 flex flex-col items-center gap-2">
                      <div className="w-10 h-10  flex justify-center items-center ">
                        <svg width="29" height="28" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="0.5" width="28" height="28" rx="14" fill="#D2D2D2" />
                          <path d="M15.1201 6.25006V15.8601H7.6801" stroke="black" stroke-width="1.86" stroke-linecap="round" />
                        </svg>

                      </div>
                      <div className="text-center text-gray-300 text-xs font-medium font-['-apple-system',_'BlinkMacSystemFont',_'SF_Pro_Text',_'Helvetica_Neue',_'Segoe_UI',_'Roboto',_'sans-serif'] uppercase tracking-wide">Status</div>
                    </div>
                    <div className="relative z-10 flex flex-col items-center gap-3">
                      <div className="text-white text-base md:text-lg font-semibold font-['-apple-system',_'BlinkMacSystemFont',_'SF_Pro_Display',_'Helvetica_Neue',_'Segoe_UI',_'Roboto',_'sans-serif']">Cleaning</div>
                      <div className="px-3 py-1 bg-yellow-500/20 backdrop-blur-sm rounded-full border border-yellow-500/30">
                        <div className="text-yellow-400 text-xs font-medium font-['-apple-system',_'BlinkMacSystemFont',_'SF_Pro_Text',_'Helvetica_Neue',_'Segoe_UI',_'Roboto',_'sans-serif']">14 min left</div>
                      </div>
                    </div>
                  </div>
                  <div className="relative w-full p-5 md:p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl hover:bg-white/10 transition-all duration-300 flex flex-col items-center gap-3 overflow-hidden">
                    {/* Red gradient overlay covering bottom half */}
                    <div className="absolute inset-0 bg-gradient-to-t from-red-500/30 via-red-500/15 to-transparent rounded-2xl"></div>
                    
                    <div className="relative z-10 flex flex-col items-center gap-2">
                      <div className="w-10 h-10 flex justify-center items-center">
                        <svg width="37" height="27" viewBox="0 0 37 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16.9 7.6L15.4491 10.1604C14.5788 11.6962 15.6882 13.6 17.4535 13.6C19.095 13.6 20.2098 15.2679 19.5822 16.7847L18.5 19.4M7.9 2H26.5C30.0346 2 32.9 4.86538 32.9 8.4V18.6C32.9 22.1346 30.0346 25 26.5 25H7.9C4.36538 25 1.5 22.1346 1.5 18.6V8.4C1.5 4.86538 4.36538 2 7.9 2ZM35.5 11.3V15.5C35.5 16.218 34.918 16.8 34.2 16.8C33.482 16.8 32.9 16.218 32.9 15.5V11.3C32.9 10.582 33.482 10 34.2 10C34.918 10 35.5 10.582 35.5 11.3Z" stroke="#D2D2D2" stroke-width="2.4" stroke-linecap="round" />
                        </svg>

                      </div>
                      <div className="text-center text-gray-300 text-xs font-medium font-['-apple-system',_'BlinkMacSystemFont',_'SF_Pro_Text',_'Helvetica_Neue',_'Segoe_UI',_'Roboto',_'sans-serif'] uppercase tracking-wide">Battery Status</div>
                    </div>
                    <div className="relative z-10 flex flex-col items-center gap-3">
                      <div className="text-white text-base md:text-lg font-semibold font-['-apple-system',_'BlinkMacSystemFont',_'SF_Pro_Display',_'Helvetica_Neue',_'Segoe_UI',_'Roboto',_'sans-serif']">
                        {solarData.length > 0 ? `${solarData[0].battery}%` : '15%'}
                      </div>
                      <div className="px-3 py-1 bg-red-500/20 backdrop-blur-sm rounded-full border border-red-500/30">
                        <div className="text-red-400 text-xs font-medium font-['-apple-system',_'BlinkMacSystemFont',_'SF_Pro_Text',_'Helvetica_Neue',_'Segoe_UI',_'Roboto',_'sans-serif']">
                          {solarData.length > 0 ? `${Math.floor(solarData[0].battery / 15)} min left` : '6 min left'}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full p-5 md:p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl hover:bg-white/10 transition-all duration-300 flex flex-col items-center gap-3 sm:col-span-2 lg:col-span-1">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 flex justify-center items-center">
                        <svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11.5 1.5V2.66667V1.5ZM11.5 21.3333V22.5V21.3333ZM2.16667 12H1H2.16667ZM4.86647 5.36647L3.91667 4.41667L4.86647 5.36647ZM18.1335 5.36647L19.0833 4.41667L18.1335 5.36647ZM4.86647 18.6383L3.91667 19.5834L4.86647 18.6383ZM18.1335 18.6383L19.0833 19.5834L18.1335 18.6383ZM22 12H20.8333H22ZM16.1667 12C16.1667 14.5773 14.0773 16.6667 11.5 16.6667C8.92267 16.6667 6.83333 14.5773 6.83333 12C6.83333 9.42267 8.92267 7.33333 11.5 7.33333C14.0773 7.33333 16.1667 9.42267 16.1667 12Z" fill="#D2D2D2" />
                          <path d="M11.5 1.5V2.66667M11.5 21.3333V22.5M2.16667 12H1M4.86647 5.36647L3.91667 4.41667M18.1335 5.36647L19.0833 4.41667M4.86647 18.6383L3.91667 19.5834M18.1335 18.6383L19.0833 19.5834M22 12H20.8333M16.1667 12C16.1667 14.5773 14.0773 16.6667 11.5 16.6667C8.92267 16.6667 6.83333 14.5773 6.83333 12C6.83333 9.42267 8.92267 7.33333 11.5 7.33333C14.0773 7.33333 16.1667 9.42267 16.1667 12Z" stroke="#D2D2D2" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                      </div>
                      <div className="text-center text-gray-300 text-xs font-medium font-['-apple-system',_'BlinkMacSystemFont',_'SF_Pro_Text',_'Helvetica_Neue',_'Segoe_UI',_'Roboto',_'sans-serif'] uppercase tracking-wide">Efficiency</div>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <div className="text-green-400 text-base md:text-lg font-bold font-['-apple-system',_'BlinkMacSystemFont',_'SF_Pro_Display',_'Helvetica_Neue',_'Segoe_UI',_'Roboto',_'sans-serif']">+16%</div>
                      <div className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-all duration-200">
                        <div className="text-white text-xs font-medium font-['-apple-system',_'BlinkMacSystemFont',_'SF_Pro_Text',_'Helvetica_Neue',_'Segoe_UI',_'Roboto',_'sans-serif']">See full Report →</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col items-start gap-6 md:gap-8">
              <div className="w-full flex justify-between items-center">
                <div className="text-white text-xl md:text-2xl lg:text-3xl font-semibold font-['-apple-system',_'BlinkMacSystemFont',_'SF_Pro_Display',_'Helvetica_Neue',_'Segoe_UI',_'Roboto',_'sans-serif'] tracking-tight">Scheduled Cleans</div>
                <div className="w-10 h-10 bg-blue-500/20 backdrop-blur-sm rounded-xl flex justify-center items-center border border-blue-500/30 hover:bg-blue-500/30 transition-all duration-200 shadow-lg cursor-pointer" onClick={handleRefresh}>
                  <RefreshCw className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <div className="w-full flex flex-col items-start gap-3">
                {loading ? (
                  <div className="w-full p-5 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg flex justify-center items-center">
                    <div className="text-gray-400 text-sm font-medium">Loading scheduled cleans...</div>
                  </div>
                ) : error ? (
                  <div className="w-full p-5 bg-red-500/10 backdrop-blur-xl rounded-2xl border border-red-500/30 shadow-lg flex justify-center items-center">
                    <div className="text-red-400 text-sm font-medium">{error}</div>
                  </div>
                ) : solarData.length > 0 ? (
                  solarData.slice(0, 5).map((item) => (
                    <div key={item._id} className="w-full p-5 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg hover:bg-white/10 transition-all duration-200 flex justify-between items-center cursor-pointer" onClick={() => handleCleanItemClick(item)}>
                      <div className="flex flex-col items-start gap-1">
                        <div className="text-white text-base md:text-lg font-semibold font-['-apple-system',_'BlinkMacSystemFont',_'SF_Pro_Display',_'Helvetica_Neue',_'Segoe_UI',_'Roboto',_'sans-serif']">
                          {formatDate(item.runTime)}
                        </div>
                        <div className="text-gray-400 text-sm md:text-base font-normal font-['-apple-system',_'BlinkMacSystemFont',_'SF_Pro_Text',_'Helvetica_Neue',_'Segoe_UI',_'Roboto',_'sans-serif']">
                          Device Id: {item.espId} | Battery: {item.battery}%
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  ))
                ) : (
                  <div className="w-full p-5 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg flex justify-center items-center">
                    <div className="text-gray-400 text-sm font-medium">No scheduled cleans found</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-6 mx-4 max-w-sm w-full">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-center">
                <div className="text-white text-lg font-semibold font-['-apple-system',_'BlinkMacSystemFont',_'SF_Pro_Display',_'Helvetica_Neue',_'Segoe_UI',_'Roboto',_'sans-serif']">
                  Refresh Successful!
                </div>
                <div className="text-gray-400 text-sm font-normal font-['-apple-system',_'BlinkMacSystemFont',_'SF_Pro_Text',_'Helvetica_Neue',_'Segoe_UI',_'Roboto',_'sans-serif'] mt-1">
                  Data has been updated
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Popup */}
      {showDetailPopup && selectedCleanItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={closeDetailPopup}>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-6 mx-4 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col gap-6">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div className="text-white text-xl font-semibold font-['-apple-system',_'BlinkMacSystemFont',_'SF_Pro_Display',_'Helvetica_Neue',_'Segoe_UI',_'Roboto',_'sans-serif']">
                  Cleaning Session Details
                </div>
                <button 
                  onClick={closeDetailPopup}
                  className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-200"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="space-y-4">
                {/* Device Information */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-gray-400 text-sm font-medium mb-2">Device Information</div>
                  <div className="text-white text-lg font-semibold">{selectedCleanItem.espId}</div>
                </div>

                {/* Battery Status */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-gray-400 text-sm font-medium mb-2">Battery Status</div>
                  <div className="flex items-center gap-3">
                    <div className="text-white text-2xl font-bold">{selectedCleanItem.battery}%</div>
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          selectedCleanItem.battery > 50 ? 'bg-green-400' : 
                          selectedCleanItem.battery > 20 ? 'bg-yellow-400' : 'bg-red-400'
                        }`}
                        style={{ width: `${selectedCleanItem.battery}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Run Time */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-gray-400 text-sm font-medium mb-2">Run Time</div>
                  <div className="text-white text-lg font-semibold">{formatDate(selectedCleanItem.runTime)}</div>
                  <div className="text-gray-400 text-sm mt-1">
                    {new Date(selectedCleanItem.runTime).toLocaleString()}
                  </div>
                </div>

                {/* Estimated Runtime */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-gray-400 text-sm font-medium mb-2">Estimated Runtime Remaining</div>
                  <div className="text-white text-lg font-semibold">
                    {Math.floor(selectedCleanItem.battery / 15)} minutes
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button 
                onClick={closeDetailPopup}
                className="w-full py-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl border border-blue-500/30 transition-all duration-200"
              >
                <div className="text-blue-400 font-medium">Close</div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default App

