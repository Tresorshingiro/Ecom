import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'}/>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt=''/>
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem atque molestias exercitationem commodi inventore maxime voluptatum ut a omnis officia. Odio quasi aliquam nemo, ipsum eos repellat esse distinctio praesentium!</p>
          <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ducimus totam suscipit eum minus, temporibus dolore optio fuga ex non obcaecati magnam sequi aliquid adipisci, facilis voluptate sint ad voluptates eius!</p>
          <b className='text-gray-800'>Our Mission</b>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit quaerat facilis et placeat! Saepe, quasi qui quia soluta eaque nesciunt aliquam tempora itaque rem dicta maxime nam. Soluta, corrupti quam.</p>
        </div>
      </div>
      <div className='text-4xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'}/>
      </div>
      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem, eos eveniet nulla ipsam blanditiis necessitatibus, accusantium dolorum enim nihil quo facilis, voluptate eaque quas? Ratione explicabo minima sunt quae eaque!</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex-col gap-5'>
          <b>Convenience:</b>
          <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem, eos eveniet nulla ipsam blanditiis necessitatibus, accusantium dolorum enim nihil quo facilis, voluptate eaque quas? Ratione explicabo minima sunt quae eaque!</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex-col gap-5'>
          <b>Exceptional Customer Service:</b>
          <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem, eos eveniet nulla ipsam blanditiis necessitatibus, accusantium dolorum enim nihil quo facilis, voluptate eaque quas? Ratione explicabo minima sunt quae eaque!</p>
        </div>
      </div>

      <NewsletterBox/>
      
    </div>
  )
}

export default About
