export interface ApprovedImageAsset {
  src: string;
  alt: string;
  category: "Office" | "Nakuru" | "Legal Library";
  caption: string;
}

export const APPROVED_IMAGES: Record<
  "heroChambers" | "nakuruOffice" | "legalLibrary" | "consultationRoom" | "landNakuru",
  ApprovedImageAsset
> = {
  heroChambers: {
    src: "/images/hero-chambers.jpg",
    alt: "Imbwaga, Yogo & Partners Advocates chambers boardroom and law library overlooking Rift Valley hills",
    category: "Office",
    caption: "Chambers boardroom and legal library",
  },
  nakuruOffice: {
    src: "/images/nakuru-office.jpg",
    alt: "Modern commercial office building along a tree-lined avenue in Nakuru with Menengai hills in the distance",
    category: "Nakuru",
    caption: "Nakuru commercial district, Mburu Gichua Road",
  },
  legalLibrary: {
    src: "/images/legal-library.jpg",
    alt: "Brass scales of justice on a timber desk in front of leather-bound Kenyan statute volumes",
    category: "Legal Library",
    caption: "Reference statutes and legal research library",
  },
  consultationRoom: {
    src: "/images/consultation-room.jpg",
    alt: "Private legal consultation room with leather armchairs and natural window light",
    category: "Office",
    caption: "Private consultation room at Gate House, Nakuru",
  },
  landNakuru: {
    src: "/images/land-nakuru.jpg",
    alt: "Fertile agricultural land and Rift Valley hills near Nakuru under morning sunlight",
    category: "Nakuru",
    caption: "Rift Valley agricultural and land corridor, Nakuru County",
  },
};

const AREA_IMAGE_MAP: Record<string, ApprovedImageAsset> = {
  "land-property-conveyancing": APPROVED_IMAGES.landNakuru,
  "succession-probate": APPROVED_IMAGES.legalLibrary,
  "civil-commercial-litigation": APPROVED_IMAGES.legalLibrary,
  "family-children": APPROVED_IMAGES.consultationRoom,
  "employment-labour": APPROVED_IMAGES.consultationRoom,
  "corporate-commercial": APPROVED_IMAGES.heroChambers,
  "banking-securities-debt-recovery": APPROVED_IMAGES.heroChambers,
  "agriculture-cooperatives-saccos": APPROVED_IMAGES.landNakuru,
  "insurance-personal-injury": APPROVED_IMAGES.nakuruOffice,
  "criminal-defence": APPROVED_IMAGES.legalLibrary,
  "constitutional-administrative-law": APPROVED_IMAGES.legalLibrary,
  "alternative-dispute-resolution": APPROVED_IMAGES.consultationRoom,
};

export function getAreaImage(slug?: string): ApprovedImageAsset {
  if (slug && AREA_IMAGE_MAP[slug]) {
    return AREA_IMAGE_MAP[slug];
  }
  return APPROVED_IMAGES.heroChambers;
}
