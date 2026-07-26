import { useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { getCurrentCognitoSession, userPool } from '../auth/cognito.js'

const UPLOAD_VISA_MATERIAL_URL =
  'https://13vv85w9ef.execute-api.ap-southeast-2.amazonaws.com/default/uploadVisaMaterial'
const LIST_VISA_MATERIALS_URL =
  'https://sukx9s9w04.execute-api.ap-southeast-2.amazonaws.com/default/listVisaMaterials'
const DELETE_VISA_MATERIAL_URL =
  'https://860qyhzj7h.execute-api.ap-southeast-2.amazonaws.com/default/deleteVisaMaterial'
const RENAME_VISA_MATERIAL_URL =
  'https://u2yxmpqr3f.execute-api.ap-southeast-2.amazonaws.com/default/renameVisaMaterial'
const VISA_PORTAL_PROFILE_API_URL =
  'https://kv8yy4iiyg.execute-api.ap-southeast-2.amazonaws.com/default/portalVisaProfile'
const MAX_FILES_PER_UPLOAD = 10
const MAX_FILE_BYTES = 50 * 1024 * 1024

const contentTypeByExtension = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

const visaTypeOptions = [
  { id: 'visitor', label: '旅游签' },
  { id: 'student', label: '学签' },
  { id: 'work', label: '工签' },
  { id: 'partner', label: '配偶类签证' },
]

const materialGroupsByVisaType = {
  visitor: [
    {
      id: 'identity',
      title: '基础身份材料',
      description: '申请人清晰大头贴照片、护照首页、身份证正反面、户口本清晰扫描件。',
    },
    {
      id: 'visaHistory',
      title: '签证历史与背景',
      description: '之前新西兰签证或其他国家签证；如有其他国家拒签记录或犯罪记录，也请上传说明或相关文件。',
    },
    {
      id: 'employment',
      title: '工作或退休证明',
      description: '如在职：单位准假信、个税社保记录、雇佣合同；如退休：退休证清晰扫描件。',
    },
    {
      id: 'invitation',
      title: '邀请人与关系材料',
      description: '新西兰本地邀请人邀请函、邀请人护照、居民签证页，以及邀请人与申请人的关系证明文件。',
    },
    {
      id: 'funds',
      title: '资金与资产材料',
      description: '个人银行流水、国内固定资产、理财或其他大额固定资产文件。',
    },
    {
      id: 'travelForms',
      title: '行程与表格',
      description: '机票信息（如有）、申请人信息表格、网签授权表格。',
    },
  ],
  student: [
    {
      id: 'identity',
      title: '基础身份材料',
      description: '申请人清晰大头贴照片、护照首页、身份证正反面、户口本清晰扫描件。',
    },
    {
      id: 'school',
      title: '学校材料',
      description: 'Offer of Place、学费缴费证明、住宿安排（如有）等。',
    },
    {
      id: 'education',
      title: '学历材料',
      description: '毕业证、成绩单、在读证明、英语成绩（如有）。',
    },
    {
      id: 'funds',
      title: '资金材料',
      description: '银行流水、存款证明、父母收入证明、资金来源说明等。',
    },
    {
      id: 'family',
      title: '家庭关系材料',
      description: '父母身份证、出生证明、亲属关系证明等。',
    },
    {
      id: 'visaHistory',
      title: '签证历史与声明',
      description: '之前签证、拒签记录、无犯罪或体检相关材料（如适用）。',
    },
  ],
  work: [
    {
      id: 'identity',
      title: '基础身份材料',
      description: '申请人清晰大头贴照片、护照首页、身份证正反面、户口本清晰扫描件。',
    },
    {
      id: 'employer',
      title: '雇主与职位材料',
      description: 'Job Offer、雇佣合同、Job Description、雇主补充材料（如有）。',
    },
    {
      id: 'experience',
      title: '工作经验证明',
      description: '工作证明、推荐信、社保/个税、工资流水、过往雇佣合同等。',
    },
    {
      id: 'qualification',
      title: '学历与资格证书',
      description: '毕业证、成绩单、职业证书、培训证书等。',
    },
    {
      id: 'background',
      title: '签证历史与背景',
      description: '之前签证、拒签记录、犯罪记录说明等。',
    },
    {
      id: 'family',
      title: '家庭成员材料',
      description: '如带配偶或孩子，请上传结婚证、子女出生证明、配偶/子女护照等。',
    },
  ],
  partner: [
    {
      id: 'identity',
      title: '基础身份材料',
      description: '申请人清晰大头贴照片、护照首页、身份证正反面、户口本清晰扫描件。',
    },
    {
      id: 'marriageCertificate',
      title: '1. 结婚证',
      description: '结婚证原件、翻译件或公证件。',
    },
    {
      id: 'childrenBirthCertificates',
      title: '2. 双方共同子女出生证明',
      description: '双方共同子女的出生证明原件、翻译件或公证件。',
    },
    {
      id: 'sharedIncomeBankTransfer',
      title: '3. 共同收入或资金往来',
      description: '共同收入、联名银行账户、能够显示双方资金往来的账户记录，或微信等互相转款证明。',
    },
    {
      id: 'sharedAssets',
      title: '4. 共同资产证明',
      description: '共同拥有任何资产的证明，例如房产证、保险等。',
    },
    {
      id: 'sharedFinanceAgreement',
      title: '5. 联名信用卡或财务协议',
      description: '联名信用卡或共同签署的财务协议，例如汽车贷款；或一方房本加房贷合同等。',
    },
    {
      id: 'chatRecords',
      title: '6. 聊天及通信记录',
      description: '双方聊天及其他通信记录，例如微信聊天记录；微信名字建议改成拼音名字，例如张三 = ZHANG San。',
    },
    {
      id: 'socialMediaPhotos',
      title: '7. 社交媒体内容或合照',
      description: '双方共同发布的社交媒体内容或合照；微信名字也建议修改为拼音名字。',
    },
    {
      id: 'supportLetters',
      title: '8. 支持信',
      description: '认可并证明双方伴侣关系的支持信，例如亲属、朋友、当地居委会支持信。',
    },
    {
      id: 'otherRelationshipEvidence',
      title: '9. 其他关系证明',
      description: '其他能够证明双方关系真实且稳定的材料。',
    },
    {
      id: 'jointLease',
      title: '10. 联名租赁合同或租金收据',
      description: '联名租赁合同或租金收据。',
    },
    {
      id: 'jointUtilityBills',
      title: '11. 联名账单',
      description: '联名水电、燃气或电话账户及账单。',
    },
    {
      id: 'sameAddressLetters',
      title: '12. 共同地址信件',
      description: '寄送至双方共同居住地址，并写有其中一方或双方姓名的信件。',
    },
    {
      id: 'timelinePhotos',
      title: '13. 同框照片',
      description: '过去10年内同框照片15-20张，时间跨度建议至少2年。',
    },
    {
      id: 'videoCallScreenshots',
      title: '14. 视频电话截图',
      description: '视频电话截图6-8张。',
    },
  ],
}

function formatFileSize(bytes) {
  if (!bytes) return '0 KB'
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function formatUploadedAt(value) {
  if (!value) return '时间未记录'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getMaterialTypeLabel(material) {
  if (material.isImage) return '图片'
  if (material.isPdf) return 'PDF'
  const materialName = getMaterialName(material).toLowerCase()
  if (materialName.endsWith('.docx')) return 'DOCX'
  if (materialName.endsWith('.doc')) return 'DOC'
  return '文件'
}

function MaterialPreview({ material }) {
  const [imageFailed, setImageFailed] = useState(false)

  if (material.isImage && material.viewUrl && !imageFailed) {
    return (
      <img
        src={material.viewUrl}
        alt={getMaterialName(material)}
        loading="lazy"
        onError={() => setImageFailed(true)}
      />
    )
  }

  return <span>{getMaterialTypeLabel(material)}</span>
}

function getFileContentType(file) {
  const extension = file.name.split('.').pop()?.toLowerCase() || ''
  return contentTypeByExtension[extension] || file.type || ''
}

function getMaterialName(material) {
  return material.originalName || material.displayName || material.name || material.s3Key?.split('/').pop() || '未命名文件'
}

function getAllMaterials(materialsByGroup) {
  return Object.entries(materialsByGroup).flatMap(([key, records]) => (
    Array.isArray(records) ? records.map((material) => ({ ...material, groupKey: key })) : []
  ))
}

function getVisaTypeLabel(visaType) {
  return visaTypeOptions.find((option) => option.id === visaType)?.label || visaType || '未分类签证'
}

function getMaterialGroupTitle(visaType, categoryId) {
  const group = materialGroupsByVisaType[visaType]?.find((item) => item.id === categoryId)
  return group?.title || categoryId || '未分类材料'
}

function sanitizeZipPathPart(value, fallback) {
  const text = String(value || '').trim().replace(/[\\/:*?"<>|\x00-\x1f]+/g, '-').replace(/\.+$/g, '')
  return text || fallback
}

function getZipPath(material, index) {
  const [keyVisaType = material.visaType, keyCategoryId = material.categoryId] = String(material.groupKey || '').split('#')
  const visaType = material.visaType || keyVisaType
  const categoryId = material.categoryId || keyCategoryId
  const visaLabel = sanitizeZipPathPart(getVisaTypeLabel(visaType), '未分类签证')
  const categoryTitle = sanitizeZipPathPart(material.categoryTitle || getMaterialGroupTitle(visaType, categoryId), '未分类材料')
  const filename = sanitizeZipPathPart(getMaterialName(material), `材料-${index + 1}`)
  return `materials/${visaLabel}/${categoryTitle}/${filename}`
}

function encodeUtf8(value) {
  return new TextEncoder().encode(value)
}

function makeCrcTable() {
  return Array.from({ length: 256 }, (_, index) => {
    let value = index
    for (let bit = 0; bit < 8; bit += 1) {
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1
    }
    return value >>> 0
  })
}

const crcTable = makeCrcTable()

function crc32(bytes) {
  let crc = 0xffffffff
  for (let index = 0; index < bytes.length; index += 1) {
    crc = crcTable[(crc ^ bytes[index]) & 0xff] ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

function writeUint16(bytes, offset, value) {
  bytes[offset] = value & 0xff
  bytes[offset + 1] = (value >>> 8) & 0xff
}

function writeUint32(bytes, offset, value) {
  bytes[offset] = value & 0xff
  bytes[offset + 1] = (value >>> 8) & 0xff
  bytes[offset + 2] = (value >>> 16) & 0xff
  bytes[offset + 3] = (value >>> 24) & 0xff
}

function createZip(files) {
  const fileParts = []
  const centralParts = []
  let offset = 0

  files.forEach((file) => {
    const nameBytes = encodeUtf8(file.path)
    const data = file.bytes
    const checksum = crc32(data)

    const localHeader = new Uint8Array(30 + nameBytes.length)
    writeUint32(localHeader, 0, 0x04034b50)
    writeUint16(localHeader, 4, 20)
    writeUint16(localHeader, 6, 0x0800)
    writeUint16(localHeader, 8, 0)
    writeUint32(localHeader, 14, checksum)
    writeUint32(localHeader, 18, data.length)
    writeUint32(localHeader, 22, data.length)
    writeUint16(localHeader, 26, nameBytes.length)
    localHeader.set(nameBytes, 30)

    const centralHeader = new Uint8Array(46 + nameBytes.length)
    writeUint32(centralHeader, 0, 0x02014b50)
    writeUint16(centralHeader, 4, 20)
    writeUint16(centralHeader, 6, 20)
    writeUint16(centralHeader, 8, 0x0800)
    writeUint16(centralHeader, 10, 0)
    writeUint32(centralHeader, 16, checksum)
    writeUint32(centralHeader, 20, data.length)
    writeUint32(centralHeader, 24, data.length)
    writeUint16(centralHeader, 28, nameBytes.length)
    writeUint32(centralHeader, 42, offset)
    centralHeader.set(nameBytes, 46)

    fileParts.push(localHeader, data)
    centralParts.push(centralHeader)
    offset += localHeader.length + data.length
  })

  const centralSize = centralParts.reduce((total, part) => total + part.length, 0)
  const endRecord = new Uint8Array(22)
  writeUint32(endRecord, 0, 0x06054b50)
  writeUint16(endRecord, 8, files.length)
  writeUint16(endRecord, 10, files.length)
  writeUint32(endRecord, 12, centralSize)
  writeUint32(endRecord, 16, offset)

  return new Blob([...fileParts, ...centralParts, endRecord], { type: 'application/zip' })
}

async function parseApiResponse(response) {
  const data = await response.json().catch(() => ({}))
  if (!response.ok || data?.success === false || data?.ok === false) {
    throw new Error(data?.message || data?.error || `请求失败：HTTP ${response.status}`)
  }
  return data
}

function VisaPortalMaterialsPage({
  embedded = false,
  adminProfileId = '',
  adminClientName = '',
  adminMaterials = null,
}) {
  const navigate = useNavigate()
  const isAdminMode = embedded && Boolean(adminProfileId)
  const [authState, setAuthState] = useState({ loading: true, sub: '', profileId: '', error: '' })
  const [selectedVisaType, setSelectedVisaType] = useState('visitor')
  const [filesByGroup, setFilesByGroup] = useState({})
  const [submitStateByGroup, setSubmitStateByGroup] = useState({})
  const [savedMaterialsByGroup, setSavedMaterialsByGroup] = useState({})
  const [deleteDialog, setDeleteDialog] = useState(null)
  const [deleteState, setDeleteState] = useState({ status: 'idle', message: '' })
  const [renameDialog, setRenameDialog] = useState(null)
  const [renameName, setRenameName] = useState('')
  const [renameState, setRenameState] = useState({ status: 'idle', message: '' })
  const [materialListState, setMaterialListState] = useState({
    status: 'idle',
    message: '',
    totalCount: 0,
  })
  const [downloadAllState, setDownloadAllState] = useState({ status: 'idle', message: '' })

  useEffect(() => {
    let cancelled = false

    getCurrentCognitoSession()
      .then(async (session) => {
        if (cancelled) return
        const payload = session.getIdToken().payload || {}
        const sub = payload.sub || ''
        const rawGroups = payload['cognito:groups']
        const groups = Array.isArray(rawGroups)
          ? rawGroups
          : String(rawGroups || '').replace(/^\[|\]$/g, '').split(',').map((group) => group.trim()).filter(Boolean)

        if (isAdminMode) {
          const initialMaterials =
            adminMaterials && typeof adminMaterials === 'object' ? adminMaterials : {}
          const initialTotalCount = Object.values(initialMaterials).reduce(
            (total, records) => total + (Array.isArray(records) ? records.length : 0),
            0,
          )
          setSavedMaterialsByGroup(initialMaterials)
          setMaterialListState({
            status: 'success',
            message: '',
            totalCount: initialTotalCount,
          })
          setAuthState({
            loading: false,
            sub,
            profileId: groups.includes('admin') ? adminProfileId : '',
            error: groups.includes('admin') ? '' : '后台材料管理需要使用 Cognito 管理员账号登录。',
          })
          return
        }

        try {
          const res = await fetch(VISA_PORTAL_PROFILE_API_URL, {
            headers: {
              Authorization: session.getIdToken().getJwtToken(),
            },
          })
          const data = await res.json().catch(() => ({}))
          if (!res.ok || data?.ok === false) {
            throw new Error(data?.message || `读取客户资料失败 HTTP ${res.status}`)
          }
          if (cancelled) return
          setAuthState({
            loading: false,
            sub,
            profileId: data?.profileId || '',
            error: '',
          })
        } catch (error) {
          if (cancelled) return
          const fallbackProfileId = sub ? `visa_user_${sub}` : ''
          setAuthState({
            loading: false,
            sub,
            profileId: fallbackProfileId,
            error: fallbackProfileId ? '' : error instanceof Error ? error.message : '客户资料读取失败',
          })
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAuthState({
            loading: false,
            sub: '',
            profileId: '',
            error: '',
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [adminMaterials, adminProfileId, isAdminMode])

  const loadSavedMaterials = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setMaterialListState((prev) => ({ ...prev, status: 'loading', message: '' }))
    }

    try {
      const session = await getCurrentCognitoSession()
      const listUrl = isAdminMode
        ? `${LIST_VISA_MATERIALS_URL}?profileId=${encodeURIComponent(authState.profileId)}`
        : LIST_VISA_MATERIALS_URL
      const response = await fetch(listUrl, {
        method: 'GET',
        headers: {
          Authorization: session.getIdToken().getJwtToken(),
        },
      })
      const data = await parseApiResponse(response)
      const materials = data?.materials && typeof data.materials === 'object' ? data.materials : {}

      setSavedMaterialsByGroup(materials)
      setMaterialListState({
        status: 'success',
        message: '',
        totalCount: Number(data?.totalCount) || 0,
      })
    } catch (error) {
      if (isAdminMode && adminMaterials && typeof adminMaterials === 'object') {
        const totalCount = Object.values(adminMaterials).reduce(
          (total, records) => total + (Array.isArray(records) ? records.length : 0),
          0,
        )
        setSavedMaterialsByGroup(adminMaterials)
        setMaterialListState({
          status: 'success',
          message: '',
          totalCount,
        })
        return
      }

      setMaterialListState((prev) => ({
        ...prev,
        status: 'error',
        message: error instanceof Error ? error.message : '读取已上传材料失败',
      }))
    }
  }, [authState.profileId, isAdminMode])

  useEffect(() => {
    if (!authState.loading && authState.sub && authState.profileId) {
      void loadSavedMaterials()
    }
  }, [authState.loading, authState.profileId, authState.sub, loadSavedMaterials])

  const totalFiles = useMemo(
    () => Object.values(filesByGroup).reduce((total, groupFiles) => total + groupFiles.length, 0),
    [filesByGroup],
  )
  const allSavedMaterials = useMemo(
    () => getAllMaterials(savedMaterialsByGroup),
    [savedMaterialsByGroup],
  )

  const currentMaterialGroups = materialGroupsByVisaType[selectedVisaType] || materialGroupsByVisaType.visitor
  const selectedVisaLabel =
    visaTypeOptions.find((option) => option.id === selectedVisaType)?.label || '旅游签'

  const groupKey = (groupId) => `${selectedVisaType}:${groupId}`

  const downloadAllMaterials = async () => {
    const downloadableMaterials = allSavedMaterials.filter((material) => material.downloadUrl || material.viewUrl)
    if (!downloadableMaterials.length) {
      setDownloadAllState({ status: 'error', message: '暂无可下载的材料' })
      return
    }

    try {
      setDownloadAllState({
        status: 'downloading',
        message: `正在打包 ${downloadableMaterials.length} 个文件...`,
      })

      const usedPaths = new Map()
      const files = []
      for (let index = 0; index < downloadableMaterials.length; index += 1) {
        const material = downloadableMaterials[index]
        setDownloadAllState({
          status: 'downloading',
          message: `正在打包 ${index + 1}/${downloadableMaterials.length}：${getMaterialName(material)}`,
        })

        const response = await fetch(material.downloadUrl || material.viewUrl)
        if (!response.ok) {
          throw new Error(`下载失败：${getMaterialName(material)}（HTTP ${response.status}）`)
        }

        const rawPath = getZipPath(material, index)
        const seenCount = usedPaths.get(rawPath) || 0
        usedPaths.set(rawPath, seenCount + 1)
        const path = seenCount
          ? rawPath.replace(/(\.[^./]+)?$/, `-${seenCount + 1}$1`)
          : rawPath

        files.push({
          path,
          bytes: new Uint8Array(await response.arrayBuffer()),
        })
      }

      const zipBlob = createZip(files)
      const zipUrl = URL.createObjectURL(zipBlob)
      const link = document.createElement('a')
      link.href = zipUrl
      link.download = `${sanitizeZipPathPart(adminClientName, '客户')}-materials.zip`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(zipUrl)
      setDownloadAllState({
        status: 'success',
        message: `已打包 ${files.length} 个文件为 materials 文件夹`,
      })
    } catch (error) {
      setDownloadAllState({
        status: 'error',
        message: error instanceof Error ? error.message : '打包下载失败，请重试',
      })
    }
  }

  const addFiles = (groupId, fileList) => {
    const nextFiles = Array.from(fileList || [])
    if (!nextFiles.length) return
    const key = groupKey(groupId)
    setFilesByGroup((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), ...nextFiles],
    }))
  }

  const removeFile = (groupId, fileIndex) => {
    const key = groupKey(groupId)
    setFilesByGroup((prev) => ({
      ...prev,
      [key]: (prev[key] || []).filter((_, index) => index !== fileIndex),
    }))
  }

  const openDeleteDialog = (group, material) => {
    setDeleteState({ status: 'idle', message: '' })
    setDeleteDialog({
      visaType: selectedVisaType,
      categoryId: group.id,
      categoryTitle: group.title,
      material,
    })
  }

  const closeDeleteDialog = () => {
    if (deleteState.status === 'deleting') return
    setDeleteDialog(null)
    setDeleteState({ status: 'idle', message: '' })
  }

  const deleteSavedMaterial = async () => {
    if (!deleteDialog || !authState.profileId) return

    setDeleteState({ status: 'deleting', message: '' })
    try {
      const session = await getCurrentCognitoSession()
      const response = await fetch(DELETE_VISA_MATERIAL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: session.getIdToken().getJwtToken(),
        },
        body: JSON.stringify({
          profileId: authState.profileId,
          visaType: deleteDialog.visaType,
          categoryId: deleteDialog.categoryId,
          materialId: deleteDialog.material.materialId,
          s3Key: deleteDialog.material.s3Key,
        }),
      })

      await parseApiResponse(response)
      setDeleteDialog(null)
      setDeleteState({ status: 'idle', message: '' })
      await loadSavedMaterials({ silent: true })
    } catch (error) {
      setDeleteState({
        status: 'error',
        message: error instanceof Error ? error.message : '删除材料失败，请重试',
      })
    }
  }

  const openRenameDialog = (group, material) => {
    setRenameState({ status: 'idle', message: '' })
    setRenameName(getMaterialName(material))
    setRenameDialog({
      visaType: selectedVisaType,
      categoryId: group.id,
      categoryTitle: group.title,
      material,
    })
  }

  const closeRenameDialog = () => {
    if (renameState.status === 'renaming') return
    setRenameDialog(null)
    setRenameName('')
    setRenameState({ status: 'idle', message: '' })
  }

  const renameSavedMaterial = async () => {
    const newName = renameName.trim()
    if (!renameDialog || !authState.profileId) return
    if (!newName) {
      setRenameState({ status: 'error', message: '请输入新的文件名' })
      return
    }

    setRenameState({ status: 'renaming', message: '' })
    try {
      const session = await getCurrentCognitoSession()
      const response = await fetch(RENAME_VISA_MATERIAL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: session.getIdToken().getJwtToken(),
        },
        body: JSON.stringify({
          profileId: authState.profileId,
          visaType: renameDialog.visaType,
          categoryId: renameDialog.categoryId,
          materialId: renameDialog.material.materialId,
          s3Key: renameDialog.material.s3Key,
          newName,
        }),
      })

      await parseApiResponse(response)
      setRenameDialog(null)
      setRenameName('')
      setRenameState({ status: 'idle', message: '' })
      await loadSavedMaterials({ silent: true })
    } catch (error) {
      setRenameState({
        status: 'error',
        message: error instanceof Error ? error.message : '重命名失败，请重试',
      })
    }
  }

  const submitGroupFiles = async (group) => {
    const key = groupKey(group.id)
    const groupFiles = filesByGroup[key] || []
    if (!groupFiles.length) return
    if (!authState.profileId) {
      setSubmitStateByGroup((prev) => ({
        ...prev,
        [key]: { status: 'error', message: '请先填写并保存个人信息表，再上传材料。' },
      }))
      return
    }

    setSubmitStateByGroup((prev) => ({
      ...prev,
      [key]: { status: 'uploading', message: '正在上传...' },
    }))

    try {
      if (groupFiles.length > MAX_FILES_PER_UPLOAD) {
        throw new Error(`每次最多上传 ${MAX_FILES_PER_UPLOAD} 个文件`)
      }

      const invalidFile = groupFiles.find((file) => !getFileContentType(file))
      if (invalidFile) {
        throw new Error(`不支持的文件格式：${invalidFile.name}`)
      }

      const oversizedFile = groupFiles.find((file) => file.size > MAX_FILE_BYTES)
      if (oversizedFile) {
        throw new Error(`文件不能超过 50MB：${oversizedFile.name}`)
      }

      const session = await getCurrentCognitoSession()
      const idToken = session.getIdToken().getJwtToken()
      const files = groupFiles.map((file) => ({
          name: file.name,
          type: getFileContentType(file),
          size: file.size,
        }))

      const createResponse = await fetch(UPLOAD_VISA_MATERIAL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: idToken,
        },
        body: JSON.stringify({
          action: 'create-upload',
          profileId: authState.profileId,
          visaType: selectedVisaType,
          categoryId: group.id,
          categoryTitle: group.title,
          files,
        }),
      })

      const createData = await parseApiResponse(createResponse)
      const uploads = Array.isArray(createData?.uploads) ? createData.uploads : []
      if (uploads.length !== groupFiles.length) {
        throw new Error('服务器返回的上传地址数量不正确，请重试')
      }

      const confirmedUploads = []
      for (let index = 0; index < uploads.length; index += 1) {
        const upload = uploads[index]
        const file = groupFiles[index]

        setSubmitStateByGroup((prev) => ({
          ...prev,
          [key]: {
            status: 'uploading',
            message: `正在上传 ${index + 1}/${uploads.length}：${file.name}`,
          },
        }))

        const uploadResponse = await fetch(upload.uploadUrl, {
          method: 'PUT',
          headers: upload.headers || { 'Content-Type': getFileContentType(file) },
          body: file,
        })
        if (!uploadResponse.ok) {
          throw new Error(`文件上传失败：${file.name}（HTTP ${uploadResponse.status}）`)
        }

        confirmedUploads.push({
          uploadId: upload.uploadId,
          name: upload.name,
          contentType: upload.contentType,
          s3Key: upload.s3Key,
        })
      }

      setSubmitStateByGroup((prev) => ({
        ...prev,
        [key]: { status: 'uploading', message: '文件已上传，正在保存材料记录...' },
      }))

      const confirmResponse = await fetch(UPLOAD_VISA_MATERIAL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: idToken,
        },
        body: JSON.stringify({
          action: 'confirm-upload',
          profileId: authState.profileId,
          visaType: selectedVisaType,
          categoryId: group.id,
          categoryTitle: group.title,
          uploads: confirmedUploads,
        }),
      })

      const confirmData = await parseApiResponse(confirmResponse)

      setFilesByGroup((prev) => ({
        ...prev,
        [key]: [],
      }))
      setSubmitStateByGroup((prev) => ({
        ...prev,
        [key]: {
          status: 'success',
          message: `已成功上传并保存 ${confirmData.savedCount ?? groupFiles.length} 个文件`,
        },
      }))
      await loadSavedMaterials({ silent: true })
    } catch (error) {
      setSubmitStateByGroup((prev) => ({
        ...prev,
        [key]: {
          status: 'error',
          message: error instanceof Error ? error.message : String(error),
        },
      }))
    }
  }

  if (authState.loading) {
    return embedded
      ? <div className="admin-materials-manager"><p className="visa-portal-loading">正在读取客户材料...</p></div>
      : <main className="visa-portal-page"><p className="visa-portal-loading">正在读取客户资料...</p></main>
  }

  if (!authState.sub || !userPool.getCurrentUser()) {
    if (embedded) {
      return (
        <div className="admin-materials-manager">
          <div className="visa-portal-materials-note visa-portal-materials-note--warning">
            请先使用加入 Cognito <strong>admin</strong> 组的管理员账号登录客户资料中心，再管理客户材料。
          </div>
        </div>
      )
    }
    return <Navigate to="/visa-portal/login" replace />
  }

  if (embedded && authState.error) {
    return (
      <div className="admin-materials-manager">
        <div className="visa-portal-materials-note visa-portal-materials-note--warning">{authState.error}</div>
      </div>
    )
  }

  const PageContainer = embedded ? 'div' : 'main'

  return (
    <PageContainer className={embedded ? 'admin-materials-manager' : 'visa-portal-page'}>
      <section className="visa-portal-materials">
        {!embedded && (
          <button type="button" className="visa-portal-back-btn" onClick={() => navigate('/visa-portal')}>
            返回客户中心
          </button>
        )}

        <header className="visa-portal-dashboard-head">
          <div>
            <p className="visa-portal-eyebrow">{embedded ? '客户签证材料' : 'DD Immigration Client Portal'}</p>
            <h1>{embedded ? `${adminClientName}的签证材料` : '上传签证材料'}</h1>
            <p>{embedded ? '查看、上传和管理该客户的材料。' : '请先选择申请类型，再按类别上传对应材料。'}</p>
          </div>
          <div className="visa-portal-materials-count">
            <span>已上传 <strong>{materialListState.totalCount}</strong></span>
            <small>待提交 {totalFiles} 个</small>
            {embedded && (
              <button
                type="button"
                className="visa-portal-download-all-btn"
                disabled={
                  !allSavedMaterials.length
                  || materialListState.status === 'loading'
                  || downloadAllState.status === 'downloading'
                }
                onClick={() => void downloadAllMaterials()}
              >
                {downloadAllState.status === 'downloading' ? '打包中...' : '下载全部'}
              </button>
            )}
          </div>
        </header>

        {embedded && downloadAllState.message && (
          <div
            className={`visa-portal-materials-note${
              downloadAllState.status === 'error' ? ' visa-portal-materials-note--warning' : ''
            }`}
          >
            {downloadAllState.message}
          </div>
        )}

        <div className="visa-portal-materials-note">
          当前选择：{selectedVisaLabel}。请选择对应文件后，按每个类别单独提交。
        </div>

        {!authState.profileId && (
          <div className="visa-portal-materials-note visa-portal-materials-note--warning">
            暂未找到客户资料记录。请先返回客户中心，填写并保存一次个人信息表，再上传材料。
          </div>
        )}

        {materialListState.status === 'error' && (
          <div className="visa-portal-materials-note visa-portal-materials-note--warning">
            已上传材料读取失败：{materialListState.message}
            <button type="button" onClick={() => void loadSavedMaterials()}>
              重新读取
            </button>
          </div>
        )}

        <div className="visa-portal-material-type-tabs" aria-label="选择申请类型">
          {visaTypeOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`visa-portal-material-type-btn${selectedVisaType === option.id ? ' active' : ''}`}
              onClick={() => setSelectedVisaType(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="visa-portal-materials-list">
          {currentMaterialGroups.map((group) => {
            const key = groupKey(group.id)
            const groupFiles = filesByGroup[key] || []
            const savedGroupFiles = savedMaterialsByGroup[`${selectedVisaType}#${group.id}`] || []
            const submitState = submitStateByGroup[key]
            const isUploading = submitState?.status === 'uploading'
            return (
              <section className="visa-portal-material-card" key={group.id}>
                <div>
                  <h2>{group.title}</h2>
                  <p>{group.description}</p>
                </div>

                <label className="visa-portal-upload-box">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
                    onChange={(e) => {
                      addFiles(group.id, e.target.files)
                      e.target.value = ''
                    }}
                  />
                  <span>选择文件</span>
                  <small>支持 PDF、图片、Word；单个不超过 50MB</small>
                </label>

                {groupFiles.length > 0 && (
                  <ul className="visa-portal-file-list">
                    {groupFiles.map((file, index) => (
                      <li key={`${file.name}-${file.lastModified}-${index}`}>
                        <span>{file.name}</span>
                        <small>{formatFileSize(file.size)}</small>
                        <button type="button" onClick={() => removeFile(group.id, index)}>
                          删除
                        </button>
                      </li>
                    ))}
                  </ul>
                )}


                <div className="visa-portal-saved-materials">
                  <div className="visa-portal-saved-materials-head">
                    <h3>已上传材料</h3>
                    <span>{savedGroupFiles.length} 个文件</span>
                  </div>
                  {materialListState.status === 'loading' ? (
                    <p className="visa-portal-saved-materials-empty">正在读取...</p>
                  ) : savedGroupFiles.length > 0 ? (
                    <ul className="visa-portal-saved-material-list">
                      {savedGroupFiles.map((material) => (
                        <li key={material.materialId || material.s3Key}>
                          <a
                            className="visa-portal-material-preview"
                            href={material.viewUrl || material.downloadUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`查看 ${getMaterialName(material)}`}
                          >
                            <MaterialPreview material={material} />
                          </a>
                          <div className="visa-portal-saved-material-info">
                            <strong title={getMaterialName(material)}>{getMaterialName(material)}</strong>
                            <small>
                              {formatFileSize(material.size)} · {formatUploadedAt(material.uploadedAt)}
                            </small>
                          </div>
                          <div className="visa-portal-saved-material-actions">
                            {material.viewUrl && (
                              <a href={material.viewUrl} target="_blank" rel="noreferrer">
                                查看
                              </a>
                            )}
                            <a href={material.downloadUrl} target="_blank" rel="noreferrer">
                              下载
                            </a>
                            <button
                              type="button"
                              className="visa-material-rename-btn"
                              onClick={() => openRenameDialog(group, material)}
                            >
                              重命名
                            </button>
                            <button type="button" onClick={() => openDeleteDialog(group, material)}>
                              删除
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="visa-portal-saved-materials-empty">尚未上传此类材料</p>
                  )}
                </div>
                <div className="visa-portal-material-card-actions">
                  <button
                    type="button"
                    className="visa-portal-entry-btn"
                    disabled={groupFiles.length === 0 || isUploading || !authState.profileId}
                    onClick={() => void submitGroupFiles(group)}
                  >
                    {isUploading ? '上传中...' : `提交${group.title}`}
                  </button>
                  <p>{groupFiles.length > 0 ? `已选择 ${groupFiles.length} 个文件` : '请先选择文件'}</p>
                </div>
                {submitState?.message && (
                  <p className={`visa-portal-material-status visa-portal-material-status--${submitState.status}`}>
                    {submitState.message}
                  </p>
                )}
              </section>
            )
          })}
        </div>
      </section>

      {deleteDialog && (
        <div className="visa-material-delete-backdrop" role="presentation">
          <section
            className="visa-material-delete-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="visa-material-delete-title"
          >
            <h2 id="visa-material-delete-title">确认删除材料</h2>
            <p>
              将从“{deleteDialog.categoryTitle}”中永久删除
              <strong>{getMaterialName(deleteDialog.material)}</strong>。
            </p>
            <p className="visa-material-delete-warning">删除后无法恢复，请确认文件不再需要。</p>
            {deleteState.message && (
              <p className="visa-material-delete-error" role="alert">{deleteState.message}</p>
            )}
            <div className="visa-material-delete-actions">
              <button
                type="button"
                className="visa-secondary-btn"
                disabled={deleteState.status === 'deleting'}
                onClick={closeDeleteDialog}
              >
                取消
              </button>
              <button
                type="button"
                className="visa-material-delete-confirm"
                disabled={deleteState.status === 'deleting'}
                onClick={() => void deleteSavedMaterial()}
              >
                {deleteState.status === 'deleting' ? '正在删除...' : '确认删除'}
              </button>
            </div>
          </section>
        </div>
      )}

      {renameDialog && (
        <div className="visa-material-delete-backdrop" role="presentation">
          <section
            className="visa-material-delete-dialog visa-material-rename-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="visa-material-rename-title"
          >
            <h2 id="visa-material-rename-title">重命名材料</h2>
            <p>
              正在修改“{renameDialog.categoryTitle}”中的文件：
              <strong>{getMaterialName(renameDialog.material)}</strong>
            </p>
            <label htmlFor="visa-material-rename-input">新文件名</label>
            <input
              id="visa-material-rename-input"
              type="text"
              value={renameName}
              autoFocus
              disabled={renameState.status === 'renaming'}
              onChange={(event) => setRenameName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  void renameSavedMaterial()
                }
              }}
            />
            <p className="visa-material-rename-help">可以不填写扩展名，系统会保留原文件格式。</p>
            {renameState.message && (
              <p className="visa-material-delete-error" role="alert">{renameState.message}</p>
            )}
            <div className="visa-material-delete-actions">
              <button
                type="button"
                className="visa-secondary-btn"
                disabled={renameState.status === 'renaming'}
                onClick={closeRenameDialog}
              >
                取消
              </button>
              <button
                type="button"
                className="visa-material-rename-confirm"
                disabled={renameState.status === 'renaming' || !renameName.trim()}
                onClick={() => void renameSavedMaterial()}
              >
                {renameState.status === 'renaming' ? '正在重命名...' : '确认修改'}
              </button>
            </div>
          </section>
        </div>
      )}
    </PageContainer>
  )
}

export default VisaPortalMaterialsPage
