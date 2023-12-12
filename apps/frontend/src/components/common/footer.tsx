'use client'

import { FacebookIcon, InstagramIcon, TwitterIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '../ui/button'

export const Footer = () => {
  return (
    <footer className="flex w-full items-center justify-center space-x-[50px] bg-primary pb-12 pt-9 text-primary-foreground">
      <Image
        src="/logo-footer.png"
        alt="logo fotter"
        className="mr-[30px]"
        width={153}
        height={131}
      />
      <div className="flex space-x-[30px]">
        <div className="flex flex-col space-y-[10px]">
          <h1 className="text-sm uppercase">For parents</h1>
          <div className="flex flex-col text-[13px]">
            <Link href="https://www.carelulu.com/resources/parents">
              Parent Resources
            </Link>
            <Link href="https://www.carelulu.com/how-it-works">
              How It Works
            </Link>
            <Link href="https://www.carelulu.com/testimonials">
              Testimonials
            </Link>
            <Link href="https://www.carelulu.com/terms-of-use">
              Terms of Use
            </Link>
            <Link href="https://www.carelulu.com/privacy-policy">
              Privacy Policy
            </Link>
          </div>
        </div>
        <div className="flex flex-col space-y-[10px]">
          <h1 className="text-sm uppercase">For providers</h1>
          <div className="flex flex-col text-[13px]">
            <Link href="https://www.carelulu.com/resources/childcare-providers">
              Provider Resources
            </Link>
            <Link href="https://www.carelulu.com/get-started">
              How It Works
            </Link>
            <Link href="https://www.carelulu.com/provider-testimonials">
              Testimonials
            </Link>
            <Link href="https://www.carelulu.com/terms-for-providers">
              Terms and Conditions
            </Link>
            <Link href="https://www.carelulu.com/register">
              List Your Program
            </Link>
          </div>
        </div>
        <div className="flex flex-col space-y-[10px]">
          <h1 className="text-sm uppercase">More</h1>
          <div className="flex flex-col text-[13px]">
            <Link href="https://www.carelulu.com/about-us">About Us</Link>
            <Link href="https://www.carelulu.com/press">Press</Link>
            <Link href="https://www.carelulu.com/jobs">Jobs</Link>
            <Link href="https://www.carelulu.com/contact-us">Contact Us</Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center space-y-4">
        <div className="flex space-x-3">
          <Link
            href="https://www.facebook.com/carelulu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white"
          >
            <FacebookIcon className="h-6 w-6" />
          </Link>
          <Link
            href="https://www.twitter.com/mycarelulu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white"
          >
            <TwitterIcon className="h-6 w-6" />
          </Link>
          <Link
            href="https://instagram.com/mycarelulu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white"
          >
            <InstagramIcon className="h-6 w-6" />
          </Link>
        </div>
        <Link href="https://carelulu.zendesk.com/hc/en-us">
          <Button variant="outline" className="font-normal text-primary">
            Help Center
          </Button>
        </Link>
      </div>
    </footer>
  )
}
