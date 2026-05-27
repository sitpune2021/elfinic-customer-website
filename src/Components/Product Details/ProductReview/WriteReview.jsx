import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { submitReview, selectReviewSubmitting, selectReviewSuccess, selectReviewError, resetReviewState } from '../../../store/slices/reviewSlice'
import { selectUser } from '../../../store/slices/authSlice'
import { toast } from 'react-toastify'

function WriteReview({ productId }) {
    // Redux
    const dispatch = useDispatch()
    const user = useSelector(selectUser)
    const isSubmitting = useSelector(selectReviewSubmitting)
    const submitSuccess = useSelector(selectReviewSuccess)
    const submitError = useSelector(selectReviewError)

    // State for form fields

    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [files, setFiles] = useState([]) // {file, url, error, type: 'image'|'video'}
    const [errors, setErrors] = useState({})
    const [touched, setTouched] = useState({})
    const MAX_FILES = 6
    const MAX_IMAGE_SIZE_MB = 20
    const MAX_VIDEO_SIZE_MB = 200
    const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
    const VALID_VIDEO_TYPES = ['video/mp4', 'video/webm']

    // Cleanup object URLs
    useEffect(() => {
        return () => {
            files.forEach(file => URL.revokeObjectURL(file.url))
        }
    }, [files])

    const validate = useCallback(() => {
        const newErrors = {}
        if (!rating) newErrors.rating = 'Rating is required.'
        if (!title.trim()) newErrors.title = 'Title is required.'
        else if (title.length < 3) newErrors.title = 'Title must be at least 3 characters.'
        if (!content.trim()) newErrors.content = 'Content is required.'
        else if (content.length < 20) newErrors.content = 'Content must be at least 20 characters.'
        if (files.length > MAX_FILES) newErrors.files = `Maximum ${MAX_FILES} files allowed.`
        const fileErrors = files.filter(f => f.error).map(f => f.error)
        if (fileErrors.length) newErrors.files = fileErrors[0]
        setErrors(newErrors)
        return newErrors
    }, [rating, title, content, files])

    useEffect(() => { validate() }, [rating, title, content, files, validate])

    const handleFileChange = e => {
        const newFiles = Array.from(e.target.files || [])
        if (!newFiles.length) return

        setFiles(prev => {
            const combined = [...prev]
            for (const file of newFiles) {
                if (combined.length >= MAX_FILES) break

                let error = ''
                let fileType = ''

                if (VALID_IMAGE_TYPES.includes(file.type)) {
                    fileType = 'image'
                    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
                        error = `Image exceeds ${MAX_IMAGE_SIZE_MB}MB.`
                    }
                } else if (VALID_VIDEO_TYPES.includes(file.type)) {
                    fileType = 'video'
                    if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
                        error = `Video exceeds ${MAX_VIDEO_SIZE_MB}MB.`
                    }
                } else {
                    error = 'Invalid file type. Only images and videos allowed.'
                }

                const url = URL.createObjectURL(file)
                combined.push({ file, url, error, type: fileType })
            }
            return combined
        })
        e.target.value = '' // reset input
    }

    const removeFile = index => {
        setFiles(prev => {
            const copy = [...prev]
            const removed = copy.splice(index, 1)[0]
            if (removed?.url) URL.revokeObjectURL(removed.url)
            return copy
        })
    }

    const handleBlur = field => setTouched(t => ({ ...t, [field]: true }))

    // Handle submission success/error
    useEffect(() => {
        if (submitSuccess) {
            toast.success('Review submitted successfully!')
            
            // Reset form
            setRating(0)
            setHoverRating(0)
            setTitle('')
            setContent('')
            files.forEach(f => f.url && URL.revokeObjectURL(f.url))
            setFiles([])
            setTouched({})
            
            // Reset Redux state
            dispatch(resetReviewState())
        }
    }, [submitSuccess, files, dispatch])

    useEffect(() => {
        if (submitError) {
            toast.error(submitError)
            dispatch(resetReviewState())
        }
    }, [submitError, dispatch])


    const onSubmit = e => {
        e.preventDefault()
        const validation = validate()
        if (Object.keys(validation).length) {
            console.warn('Validation failed', validation)
            setTouched({ rating: true, title: true, content: true, files: true })
            toast.error('Please fix the highlighted errors before submitting.', { toastId: 'review-validation' })
            return
        }

        // Build data object
        const image = files.filter(f => f.type === 'image')
        const video = files.filter(f => f.type === 'video')
        
        const reviewData = {
            user_id: user?.id || localStorage.getItem('userId') || '',
            productId,
            rating,
            title: title.trim(),
            content: content.trim(),
            image: image,
            video: video,
        }

        console.log('Review submission payload:', reviewData)

        // Dispatch Redux action
        dispatch(submitReview(reviewData))
    }

    const Star = ({ value }) => {
        const filled = (hoverRating || rating) >= value
        return (
            <button
                type="button"
                aria-label={`${value} star${value > 1 ? 's' : ''}`}
                className={`text-xs fw-medium d-flex transition ${filled ? 'text-warning-600' : 'text-neutral-300'}`}
                onClick={() => setRating(value)}
                onMouseEnter={() => setHoverRating(value)}
                onMouseLeave={() => setHoverRating(0)}
            >
                <i className={filled ? 'ph-fill ph-star' : 'ph ph-star'}></i>
            </button>
        )
    }

    return (
        <div className="mt-56">
            <div>
                <h5 className="mb-24">Write a Review</h5>
                <span className="text-heading mb-8 d-block">What is it like to Product?</span>
                <div className="flex-align gap-8" onBlur={() => handleBlur('rating')}>
                    {[1, 2, 3, 4, 5].map(v => <Star key={v} value={v} />)}
                </div>
                {touched.rating && errors.rating && <p className="text-danger text-xs mt-4" role="alert">{errors.rating}</p>}
            </div>
            <div className="mt-32">
                <form onSubmit={onSubmit} noValidate>
                    <input type="hidden" name="productId" value={productId} />
                    <div className="mb-32">
                        <label htmlFor="title" className="text-neutral-600 mb-8 d-block">Review Title<span className="text-danger"> *</span></label>
                        <input
                            type="text"
                            className={`common-input rounded-8 ${touched.title && errors.title ? 'is-invalid' : ''}`}
                            id="title"
                            placeholder="Great Products"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            onBlur={() => handleBlur('title')}
                            aria-invalid={!!(touched.title && errors.title)}
                            aria-describedby="title-error"
                        />
                        {touched.title && errors.title && <p id="title-error" className="text-danger text-xs mt-4" role="alert">{errors.title}</p>}
                    </div>
                    <div className="mb-32">
                        <label htmlFor="desc" className="text-neutral-600 mb-8 d-block">Review Content<span className="text-danger"> *</span></label>
                        <textarea
                            className={`common-input rounded-8 ${touched.content && errors.content ? 'is-invalid' : ''}`}
                            id="desc"
                            rows={6}
                            placeholder="Share your experience with the product..."
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            onBlur={() => handleBlur('content')}
                            aria-invalid={!!(touched.content && errors.content)}
                            aria-describedby="content-error"
                        />
                        {touched.content && errors.content && <p id="content-error" className="text-danger text-xs mt-4" role="alert">{errors.content}</p>}
                    </div>
                    <div className="mb-32">
                        <label className="text-neutral-600 mb-8 d-block">Images & Videos (up to {MAX_FILES} files)</label>
                        <div className={`border border-2 border-dashed rounded-8 p-24 text-center ${touched.files && errors.files ? 'border-danger' : 'border-neutral-300'}`} style={{ cursor: 'pointer', backgroundColor: '#f8f9fa' }}>
                            <input
                                type="file"
                                accept={[...VALID_IMAGE_TYPES, ...VALID_VIDEO_TYPES].join(',')}
                                multiple
                                onChange={handleFileChange}
                                onBlur={() => handleBlur('files')}
                                id="file-upload"
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'block' }}>
                                <i className="ph ph-upload-simple" style={{ fontSize: '48px', color: '#6c757d' }}></i>
                                <p className="mb-0 mt-8 text-neutral-600">Click to upload images or videos</p>
                                <p className="text-xs text-neutral-500 mt-4">
                                    Images: PNG, JPG, WEBP (Max {MAX_IMAGE_SIZE_MB}MB)<br />
                                    Videos: MP4, WEBM (Max {MAX_VIDEO_SIZE_MB}MB)
                                </p>
                            </label>
                        </div>
                        {touched.files && errors.files && <p className="text-danger text-xs mt-4" role="alert">{errors.files}</p>}
                        {files.length > 0 && (
                            <div className="d-flex gap-3 flex-wrap mt-3">
                                {files.map((fileItem, idx) => (
                                    <div key={idx} className="position-relative" style={{ width: 120 }}>
                                        {fileItem.type === 'image' ? (
                                            <img
                                                src={fileItem.url}
                                                alt={`Preview ${idx + 1}`}
                                                className="w-100 rounded-4 border"
                                                style={{ height: 120, objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <video
                                                src={fileItem.url}
                                                className="w-100 rounded-4 border"
                                                style={{ height: 120, objectFit: 'cover' }}
                                            />
                                        )}
                                        <button
                                            type="button"
                                            className="btn btn-danger position-absolute d-flex align-items-center justify-content-center"
                                            style={{
                                                top: 4,
                                                right: 4,
                                                width: 24,
                                                height: 24,
                                                padding: 0,
                                                borderRadius: '50%',
                                                fontSize: '16px',
                                                lineHeight: 1
                                            }}
                                            onClick={() => removeFile(idx)}
                                            aria-label={`Remove ${fileItem.type} ${idx + 1}`}
                                        >
                                            ×
                                        </button>
                                        {fileItem.error && <p className="text-danger" style={{ fontSize: '10px', marginTop: '4px' }} role="alert">{fileItem.error}</p>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button type="submit" className="btn btn-main rounded-pill mt-8" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default WriteReview