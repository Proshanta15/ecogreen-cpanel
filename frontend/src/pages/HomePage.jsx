import React, { useState, useEffect } from 'react'
import '../styles/home-page.css'
import Banner from '../components/home/Banner'
import WhoWeAre from '../components/home/WhoWeAre'
import Expertise from '../components/home/Expertise'
import Partner from '../components/home/Partner'
import Showcase from '../components/home/Showcase'
import Brands from '../components/home/Brands'
import Faq from '../components/Faq'
import FooterShowcase from '../components/FooterShowcase'
import IsLoading from '../components/IsLoading'
import { API_BASE_URL } from '../config'


const HomePage = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/home`, {
          method: "GET",
        })
        const result = await response.json()
        if (response.ok && result.success && result.data) {
          setData(result.data)
        }
      } catch (error) {
        console.error("Error fetching home page:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchHome()
  }, [])

  if (loading) {
    return (
      <div className="home-page-loading">
        <IsLoading />
      </div>
    )
  }

  return (
    <div>
      <Banner banner={data?.banner} />
      <WhoWeAre whoWeAre={data?.whoWeAre} />
      <Expertise expertise={data?.expertise} />
      <Partner partner={data?.partner} />
      <Showcase showcase={data?.showcase} />
      <Brands brands={data?.brands} />
      <Faq />
      <FooterShowcase />
    </div>
  )
}

export default HomePage
