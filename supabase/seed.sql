-- ============================================================
-- NISB People & Milestones — Local Development Seed Dataset
-- Sourced exclusively from official institutional facts (https://www.nisb.in/content.html)
-- STRICT RESTRICTION: FOR LOCAL TESTING ONLY. NEVER EXECUTE REMOTELY.
-- Zero Invented Metadata: No speculative biographies, interests, photos, or tenures.
-- Publication Integrity: Unverified roster entries set to draft + source_listed.
-- ============================================================

begin;

-- ── 1. Official Societies & Affinity Chapters (nisb.in/content.html) ──

insert into public.societies (id, slug, name, short_name, description, established_year, website_url)
values
  (
    '11111111-1111-4111-a111-000000000001',
    'nisb',
    'NIE IEEE Student Branch',
    'NISB',
    'The parent student branch at The National Institute of Engineering, Mysuru. Operating under IEEE Bangalore Section.',
    null,
    'https://nisb.in'
  ),
  (
    '11111111-1111-4111-a111-000000000002',
    'ieee-cs',
    'Computer Society',
    'CS',
    'IEEE Computer Society chapter at NISB, started in 2015.',
    '2015',
    'https://www.computer.org'
  ),
  (
    '11111111-1111-4111-a111-000000000003',
    'ieee-wie',
    'Women in Engineering',
    'WIE',
    'Women in Engineering affinity group of NISB, formed in April 2015.',
    '2015',
    'https://wie.ieee.org'
  ),
  (
    '11111111-1111-4111-a111-000000000004',
    'ieee-cass',
    'Circuits and Systems Society',
    'CASS',
    'IEEE Circuits and Systems Society chapter at NISB.',
    null,
    'https://ieee-cas.org'
  ),
  (
    '11111111-1111-4111-a111-000000000006',
    'ieee-ceda',
    'Council on Electronic Design Automation',
    'CEDA',
    'IEEE Council on Electronic Design Automation at NISB.',
    null,
    'https://ieee-ceda.org/'
  ),
  (
    '11111111-1111-4111-a111-000000000007',
    'ieee-grss',
    'Geoscience and Remote Sensing Society',
    'GRSS',
    'IEEE Geoscience and Remote Sensing Society chapter at NISB.',
    null,
    'https://www.grss-ieee.org'
  ),
  (
    '11111111-1111-4111-a111-000000000008',
    'ieee-ras',
    'Robotics and Automation Society',
    'RAS',
    'IEEE Robotics and Automation Society chapter at NISB.',
    null,
    'https://www.ieee-ras.org'
  )
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  short_name = excluded.short_name,
  description = excluded.description,
  established_year = excluded.established_year,
  website_url = excluded.website_url;


-- ── 2. Official NISB Team Entries (nisb.in/content.html#team) ──
-- Governed by official roster decision:
-- Status: 'draft', Verification Status: 'source_listed'
-- Appearance on page does NOT establish current committee.
-- Official Photographs: Integrated from nisb.in assets (cores25-26).
-- Zero invented tenures, bios, departments, or interests.
-- These records remain invisible to public directory views until verified and confirmed.

insert into public.members (
  id,
  full_name,
  role,
  department,
  batch_year,
  photo_url,
  bio,
  interests,
  tenure_start,
  tenure_end,
  status,
  verification_status,
  source_note
)
values
  (
    '22222222-2222-4222-a222-000000000001',
    'Sagar Kumar Singh',
    'Chairperson',
    null, null,
    'https://www.nisb.in/assets/cores25-26/SagarSingh.jpg',
    null, null, null, null,
    'draft',
    'source_listed',
    'Listed on official NISB website (https://www.nisb.in/content.html#team). Official photograph integrated from nisb.in assets. Verification status: source_listed.'
  ),
  (
    '22222222-2222-4222-a222-000000000002',
    'Abhay Hegde',
    'Vice Chairperson & Secretary (MP)',
    null, null,
    'https://www.nisb.in/assets/cores25-26/Abhay.jpg',
    null, null, null, null,
    'draft',
    'source_listed',
    'Listed on official NISB website (https://www.nisb.in/content.html#team). Official photograph integrated from nisb.in assets. Verification status: source_listed.'
  ),
  (
    '22222222-2222-4222-a222-000000000003',
    'Yogesh S',
    'Treasurer',
    null, null,
    'https://www.nisb.in/assets/cores25-26/Yogesh.jpg',
    null, null, null, null,
    'draft',
    'source_listed',
    'Listed on official NISB website (https://www.nisb.in/content.html#team). Official photograph integrated from nisb.in assets. Verification status: source_listed.'
  ),
  (
    '22222222-2222-4222-a222-000000000004',
    'Sakleshwar Hubli',
    'Secretary (IA)',
    null, null,
    'https://www.nisb.in/assets/cores25-26/Saklesh.jpg',
    null, null, null, null,
    'draft',
    'source_listed',
    'Listed on official NISB website (https://www.nisb.in/content.html#team). Official photograph integrated from nisb.in assets. Verification status: source_listed.'
  ),
  (
    '22222222-2222-4222-a222-000000000005',
    'K Anantha Krishna Rao',
    'Secretary (Events)',
    null, null,
    'https://www.nisb.in/assets/cores25-26/Anantha.jpg',
    null, null, null, null,
    'draft',
    'source_listed',
    'Listed on official NISB website (https://www.nisb.in/content.html#team). Official photograph integrated from nisb.in assets. Verification status: source_listed.'
  ),
  (
    '22222222-2222-4222-a222-000000000006',
    'Shreya P V',
    'Secretary (Events)',
    null, null,
    'https://www.nisb.in/assets/cores25-26/Shreya%20P%20V.jpg',
    null, null, null, null,
    'draft',
    'source_listed',
    'Listed on official NISB website (https://www.nisb.in/content.html#team). Official photograph integrated from nisb.in assets. Verification status: source_listed.'
  ),
  (
    '22222222-2222-4222-a222-000000000007',
    'Aadya Sharma',
    'Secretary (MP)',
    null, null,
    'https://www.nisb.in/assets/cores25-26/Aadya.jpeg',
    null, null, null, null,
    'draft',
    'source_listed',
    'Listed on official NISB website (https://www.nisb.in/content.html#team). Official photograph integrated from nisb.in assets. Verification status: source_listed.'
  ),
  (
    '22222222-2222-4222-a222-000000000008',
    'Sagar N Mutalik',
    'Secretary (MD) & SAC Coordinator',
    null, null,
    'https://www.nisb.in/assets/cores25-26/SagarNM.jpg',
    null, null, null, null,
    'draft',
    'source_listed',
    'Listed on official NISB website (https://www.nisb.in/content.html#team). Official photograph integrated from nisb.in assets. Verification status: source_listed.'
  ),
  (
    '22222222-2222-4222-a222-000000000009',
    'Pranav A Korlahalli',
    'Technology Coordinator',
    null, null,
    'https://www.nisb.in/assets/cores25-26/Pranav.jpg',
    null, null, null, null,
    'draft',
    'source_listed',
    'Listed on official NISB website (https://www.nisb.in/content.html#team). Official photograph integrated from nisb.in assets. Verification status: source_listed.'
  ),
  (
    '22222222-2222-4222-a222-000000000010',
    'Aashish Vatwani',
    'Technology Coordinator',
    null, null,
    'https://www.nisb.in/assets/cores25-26/Aashish.jpg',
    null, null, null, null,
    'draft',
    'source_listed',
    'Listed on official NISB website (https://www.nisb.in/content.html#team). Official photograph integrated from nisb.in assets. Verification status: source_listed.'
  ),
  (
    '22222222-2222-4222-a222-000000000011',
    'Rahul K',
    'Editor-in-Chief',
    null, null,
    'https://www.nisb.in/assets/cores25-26/Rahul.jpeg',
    null, null, null, null,
    'draft',
    'source_listed',
    'Listed on official NISB website (https://www.nisb.in/content.html#team). Official photograph integrated from nisb.in assets. Verification status: source_listed.'
  ),
  (
    '22222222-2222-4222-a222-000000000012',
    'Shresth S Juptimath',
    'Sponsorship Coordinator',
    null, null,
    'https://www.nisb.in/assets/cores25-26/Shresht.JPG',
    null, null, null, null,
    'draft',
    'source_listed',
    'Listed on official NISB website (https://www.nisb.in/content.html#team). Official photograph integrated from nisb.in assets. Verification status: source_listed.'
  ),
  (
    '22222222-2222-4222-a222-000000000013',
    'Priyanka Pramod Daivagna',
    'CS Chairperson',
    null, null,
    'https://www.nisb.in/assets/cores25-26/Priyanka.jpeg',
    null, null, null, null,
    'draft',
    'source_listed',
    'Listed on official NISB website (https://www.nisb.in/content.html#team). Official photograph integrated from nisb.in assets. Verification status: source_listed.'
  ),
  (
    '22222222-2222-4222-a222-000000000014',
    'Prerika P',
    'CS Secretary',
    null, null,
    'https://www.nisb.in/assets/cores25-26/PrerikaP.jpeg',
    null, null, null, null,
    'draft',
    'source_listed',
    'Listed on official NISB website (https://www.nisb.in/content.html#team). Official photograph integrated from nisb.in assets. Verification status: source_listed.'
  ),
  (
    '22222222-2222-4222-a222-000000000015',
    'Nikitha H S',
    'CASS Chairperson & RAS Chairperson',
    null, null,
    'https://www.nisb.in/assets/cores25-26/Nikitha.jpeg',
    null, null, null, null,
    'draft',
    'source_listed',
    'Listed on official NISB website (https://www.nisb.in/content.html#team). Official photograph integrated from nisb.in assets. Verification status: source_listed.'
  ),
  (
    '22222222-2222-4222-a222-000000000016',
    'Suma Acharya',
    'CASS Secretary',
    null, null,
    'https://www.nisb.in/assets/cores25-26/Suma.jpg',
    null, null, null, null,
    'draft',
    'source_listed',
    'Listed on official NISB website (https://www.nisb.in/content.html#team). Official photograph integrated from nisb.in assets. Verification status: source_listed.'
  ),
  (
    '22222222-2222-4222-a222-000000000017',
    'Sanjana S Shetty',
    'WIE Chairperson',
    null, null,
    'https://www.nisb.in/assets/cores25-26/SanjanaS.jpg',
    null, null, null, null,
    'draft',
    'source_listed',
    'Listed on official NISB website (https://www.nisb.in/content.html#team). Official photograph integrated from nisb.in assets. Verification status: source_listed.'
  ),
  (
    '22222222-2222-4222-a222-000000000018',
    'Panchami Urs S',
    'WIE Secretary',
    null, null,
    'https://www.nisb.in/assets/cores25-26/Panchami.jpg',
    null, null, null, null,
    'draft',
    'source_listed',
    'Listed on official NISB website (https://www.nisb.in/content.html#team). Official photograph integrated from nisb.in assets. Verification status: source_listed.'
  ),
  (
    '22222222-2222-4222-a222-000000000019',
    'Rachit Kulkarni',
    'RAS Secretary',
    null, null,
    'https://www.nisb.in/assets/cores25-26/Rachit.jpeg',
    null, null, null, null,
    'draft',
    'source_listed',
    'Listed on official NISB website (https://www.nisb.in/content.html#team). Official photograph integrated from nisb.in assets. Verification status: source_listed.'
  ),
  (
    '22222222-2222-4222-a222-000000000020',
    'Mohammed Mansooruddin',
    'GRSS Chairperson',
    null, null,
    'https://www.nisb.in/assets/cores25-26/Mansoor.jpg',
    null, null, null, null,
    'draft',
    'source_listed',
    'Listed on official NISB website (https://www.nisb.in/content.html#team). Official photograph integrated from nisb.in assets. Verification status: source_listed.'
  ),
  (
    '22222222-2222-4222-a222-000000000021',
    'Amol S',
    'GRSS Secretary',
    null, null,
    'https://www.nisb.in/assets/cores25-26/Amol.jpg',
    null, null, null, null,
    'draft',
    'source_listed',
    'Listed on official NISB website (https://www.nisb.in/content.html#team). Official photograph integrated from nisb.in assets. Verification status: source_listed.'
  )
on conflict (id) do update set
  full_name = excluded.full_name,
  role = excluded.role,
  photo_url = excluded.photo_url,
  status = excluded.status,
  verification_status = excluded.verification_status,
  source_note = excluded.source_note;

commit;
