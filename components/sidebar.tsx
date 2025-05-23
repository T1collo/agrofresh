'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import { IoHome } from "react-icons/io5"
import { MdOutlineProductionQuantityLimits } from "react-icons/md"
import { TbTruckDelivery } from "react-icons/tb"
import { BsInfoCircleFill } from "react-icons/bs"
import { PiFarmBold } from "react-icons/pi";

const links = [
  { name: "Home", url: "/", icon: <IoHome />, hoverColor: "hover:text-green-600" },
  { 
    name: "Cartalogue", 
    url: "/", 
    icon: <MdOutlineProductionQuantityLimits />, 
    hoverColor: "hover:text-blue-600",  
    children: [
      { name: "Vegetables", url: "/cartalogue/seeds" },
      { name: "Bread", url: "/cartalogue/fertilizers" },
      { name: "Cheese", url: "/cartalogue/tools" },
      { name: "Meat", url: "/cartalogue/tools" },
      { name: "Butter", url: "/cartalogue/tools" },
      { name: "Wine", url: "/cartalogue/tools" },
      { name: "Delicacies", url: "/cartalogue/tools" },
    ]
  },
  { name: "Delivery", url: "/", icon: <TbTruckDelivery />, hoverColor: "hover:text-orange-600" },
  { name: "About", url: "/", icon: <BsInfoCircleFill />, hoverColor: "hover:text-purple-600" },
]

const Sidebar = () => {
  // Track the open/close state of the Cartalogue submenu
  const [isCartalogueOpen, setCartalogueOpen] = useState(false)

  // Toggle function for Cartalogue submenu
  const toggleCartalogue = () => {
    setCartalogueOpen(prev => !prev)
  }

  return (
    <div className='flex p-7 h-screen flex-col gap-20 w-56'>
      {/* link logo */}
      <Link href="/" className="flex mb-5">
      <div className='flex items-center gap-2'>
        <PiFarmBold className='text-5xl text-green-400'/>
          <p className='font-semibold text-3xl'>farm <br /><span className='text-green-500'>grow...</span></p>
      </div>
      </Link>

      {/* links to pages */}
      <div className='flex flex-col gap-5'>
        <ul className="flex flex-col gap-5 font-semibold">
          {links.map((link, index) => (
            <li key={index}>
              <div>
                {/* Cartalogue link */}
                <Link 
                  href={link.url} 
                  className={`flex items-center gap-2 text-xl text-gray-700 transition-colors duration-300 hover:-translate-y-0.5 ${link.hoverColor}`} 
                  onClick={link.name === "Cartalogue" ? toggleCartalogue : undefined}
                >
                  {link.icon}
                  {link.name}
                </Link>

                {/* Submenu (only if children exist) */}
                {link.children && isCartalogueOpen && link.name === "Cartalogue" && (
                  <ul className={`ml-6 mt-2 flex flex-col gap-2 text-sm text-gray-600 transition-all duration-300 ease-in-out
                    ${isCartalogueOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    {link.children.map((sub, subIndex) => (
                      <li key={subIndex}>
                        <Link
                          href={sub.url}
                          className="hover:text-blue-500 transition-colors duration-200"
                        >
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* sidebar footer/ contact us */}
    </div>
  )
}

export default Sidebar
