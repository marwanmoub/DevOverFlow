"use client"

import { AskQuestionSchema } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

const QuestionForm = () => {

  const form = useForm({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: {
      title: '',
      content: '',
      tags: []
    }
  });

  const handleCreateQuestion = () => {

  }

  return (
    <Form {...form}>
      <form className='flex w-full flex-col gap-10' onSubmit={form.handleSubmit(handleCreateQuestion)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-medium text-dark400_light700">Question Title <span className='text-primary-500'>*</span> </FormLabel>
              <FormControl>
                <Input {...field} 
                className="paragraph-regular background-light-700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border"/>
              </FormControl>
              <FormDescription className='body-regular text-light-500 mt-2.5'>
                Be specific and imagine your&apos;re asking a questiona to another person
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> 

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-medium text-dark400_light700">Detailed Explanation of your problem <span className='text-primary-500'>*</span> </FormLabel>
              <FormControl>
                Editor
              </FormControl>
              <FormDescription className='body-regular text-light-500 mt-2.5'>
                Introduce the problema and expand on what you&apos;ve put in the title
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> 

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-medium text-dark400_light700">Tags <span className='text-primary-500'>*</span> </FormLabel>
              <FormControl>
                <div>
                  <Input {...field} 
                  placeholder='Add tags...'
                  className="paragraph-regular background-light-700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border"/>

                  Tags
                </div>
              </FormControl>
              <FormDescription className='body-regular text-light-500 mt-2.5'>
                Add up to 3 tags to describe what your question is about. You need to press enter to add a tag.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> 

        <div className='mt-16 flex justify-end'>
            <Button type='submit' className='primary-gradient !text-light-900 w-fit'>
              Ask A Question
            </Button>
        </div>
      </form>
    </Form>
  )
}

export default QuestionForm