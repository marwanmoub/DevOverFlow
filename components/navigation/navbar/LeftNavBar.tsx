import Image from 'next/image'
import React from 'react'
import NavLinks from './NavLinks'
import ROUTES from '@/constants/routes'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const LeftNavBar = () => {
  return (
    <section className='custom-scrollbar pt-36 flex flex-col py-6 px-5 background-light900_dark200 h-screen justify-between sticky top-0 left-0 overflow-y-auto shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]'>
        <div className='flex flex-1 flex-col gap-6'>
            <NavLinks />
        </div>

        <div className='flex flex-col gap-3'>
        <div>
            <Button asChild>
                <Link href={ROUTES.SIGN_IN} className='small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none'>
                    <Image  src="/icons/account.svg" alt='Account' width={20} height={20} className='inver-colors lg:hidden' />
                    <span className='primary-text-gradient max-lg:hidden'>Log In</span>
                </Link>
            </Button>
        </div>

        <div >
            <Button asChild>
                <Link  href={ROUTES.SIGN_UP} className='small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none'>
                    <Image  src="/icons/sign-up.svg" alt='Account' width={20} height={20} className='inver-colors lg:hidden' />
                    <span className='max-lg:hidden'>Sign Up</span>
                </Link>
            </Button>
        </div>
        </div>
    </section>
  )
}

export default LeftNavBar