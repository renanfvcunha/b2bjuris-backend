import { NextFunction, Request, Response } from 'express'
import multer from 'multer'
import path from 'path'

function pStart (num: number): string {
  return num.toString().padStart(2, '0')
}

const multerConfig = multer({
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', 'uploads', 'docs'),
    filename (req, file, cb) {
      const ext = file.originalname.split('.').pop()

      const date = new Date()

      const fileName = `DOC_${date.getFullYear().toString()}${pStart(
        date.getMonth() + 1
      )}${pStart(date.getDate())}_${pStart(date.getHours())}${pStart(
        date.getMinutes()
      )}${pStart(date.getSeconds())}${date.getMilliseconds().toString()}.${ext}`

      cb(null, fileName)
    }
  }),
  fileFilter: (req, file, cb) => {
    const isAccepted = ['application/pdf', 'application/msword'].find(
      acceptedFormat => acceptedFormat === file.mimetype
    )

    if (!isAccepted) {
      return cb(new Error('fileTypeMismatch'))
    }

    return cb(null, true)
  }
})

const uploadDocs = (req: Request, res: Response, next: NextFunction) => {
  const upload = multerConfig.array('doc')

  upload(req, res, function (err: any) {
    if (err) {
      console.log(err)
      return res.status(500).json({ msg: 'Erro ao carregar documento(s).' })
    }

    return next()
  })
}

export default uploadDocs
