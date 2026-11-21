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
    'The parent student branch at The National Institute of Engineering, Mysuru (IEEE Branch Code: STB64141). Operating under IEEE Bangalore Section.',
    null,
    'https://nisb.in'
  ),
  (
    '11111111-1111-4111-a111-000000000002',
    'ieee-cs',
    'IEEE Computer Society Student Branch Chapter',
    'IEEE CS',
    'Technical chapter dedicated to computing and computer science under NISB.',
    '2015',
    'https://www.computer.org'
  ),
  (
    '11111111-1111-4111-a111-000000000003',
    'ieee-wie',
    'IEEE Women in Engineering Student Branch Affinity Group',
    'IEEE WIE',
    'Affinity group dedicated to promoting women in engineering and STEM under NISB.',
    '2015',
    'https://wie.ieee.org'
  ),
  (
    '11111111-1111-4111-a111-000000000004',
    'ieee-cass',
    'IEEE Circuits and Systems Society Student Branch Chapter',
    'IEEE CASS',
    'Technical chapter focused on circuits and systems engineering under NISB.',
    null,
    'https://ieee-cas.org'
  ),
  (
    '11111111-1111-4111-a111-000000000005',
    'ieee-pes',
    'IEEE Power and Energy Society Student Branch Chapter',
    'IEEE PES',
    'Technical chapter dedicated to power and energy systems under NISB.',
    null,
    'https://nisb.in'
  ),
  (
    '11111111-1111-4111-a111-000000000006',
    'ieee-ceda',
    'IEEE Council on Electronic Design Automation Student Branch Chapter',
    'IEEE CEDA',
    'Technical chapter focused on electronic design automation under NISB.',
    null,
    'https://ieee-ceda.org/'
  ),
  (
    '11111111-1111-4111-a111-000000000007',
    'ieee-grss',
    'IEEE Geoscience and Remote Sensing Society Student Branch Chapter',
    'IEEE GRSS',
    'Technical chapter focused on geoscience and remote sensing technologies under NISB.',
    null,
    'https://www.grss-ieee.org'
  ),
  (
    '11111111-1111-4111-a111-000000000008',
    'ieee-ras',
    'IEEE Robotics and Automation Society Student Branch Chapter',
    'IEEE RAS',
    'Technical chapter focused on robotics and automation engineering under NISB.',
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
-- Zero invented tenures, bios, photos, interests, or contributions.
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
    null, null, null, null, null, null, null,
    'draft',
    'source_listed',
    'Listed on official NISB website (https://www.nisb.in/content.html#team). Verification status: source_listed.'
  ),
  (
    '22222222-2222-4222-a222-000000000002',
    'Abhay Hegde',
    'Vice Chairperson & Secretary (MP)',
    null, null, null, null, null, null, null,
    'draft',
    'source_listed',
    'Listed on official NISB website (https://www.nisb.in/content.html#team). Verification status: source_listed.'
  ),
  (
    '22222222-2222-4222-a222-000000000003',
    'Yogesh S',
    'Treasurer',
    null, null, null, null, null, null, null,
    'draft',
    'source_listed',
    'Listed on official NISB website (https://www.nisb.in/content.html#team). Verification status: source_listed.'
  ),
  (
    '22222222-2222-4222-a222-000000000004',
    'Sakleshwar Hubli',
    'Secretary (IA)',
    null, null, null, null, null, null, null,
    'draft',
    'source_listed',
    'Listed on official NISB website (https://www.nisb.in/content.html#team). Verification status: source_listed.'
  ),
  (
    '22222222-2222-4222-a222-000000000005',
    'K Anantha Krishna Rao',
    'Secretary (Events)',
    null, null, null, null, null, null, null,
    'draft',
    'source_listed',
    'Listed on official NISB website (https://www.nisb.in/content.html#team). Verification status: source_listed.'
  ),
  (
    '22222222-2222-4222-a222-000000000006',
    'Shreya P V',
    'Secretary (Events)',
    null, null, null, null, null, null, null,
    'draft',
    'source_listed',
    'Listed on official NISB website (https://www.nisb.in/content.html#team). Verification status: source_listed.'
  ),
  (
    '22222222-2222-4222-a222-000000000007',
    'Aadya Sharma',
    'Secretary (MP)',
    null, null, null, null, null, null, null,
    'draft',
    'source_listed',
    'Listed on official NISB website (https://www.nisb.in/content.html#team). Verification status: source_listed.'
  ),
  (
    '22222222-2222-4222-a222-000000000008',
    'Sagar N Mutalik',
    'Secretary (MD) & SAC Coordinator',
    null, null, null, null, null, null, null,
    'draft',
    'source_listed',
    'Listed on official NISB website (https://www.nisb.in/content.html#team). Verification status: source_listed.'
  ),
  (
    '22222222-2222-4222-a222-000000000009',
    'Pranav A Korlahalli',
    'Technology Coordinator',
    null, null, null, null, null, null, null,
    'draft',
    'source_listed',
    'Listed on official NISB website (https://www.nisb.in/content.html#team). Verification status: source_listed.'
  ),
  (
    '22222222-2222-4222-a222-000000000010',
    'Aashish Vatwani',
    'Technology Coordinator',
    null, null, null, null, null, null, null,
    'draft',
    'source_listed',
    'Listed on official NISB website (https://www.nisb.in/content.html#team). Verification status: source_listed.'
  ),
  (
    '22222222-2222-4222-a222-000000000011',
    'Rahul K',
    'Editor-in-Chief',
    null, null, null, null, null, null, null,
    'draft',
    'source_listed',
    'Listed on official NISB website (https://www.nisb.in/content.html#team). Verification status: source_listed.'
  ),
  (
    '22222222-2222-4222-a222-000000000012',
    'Shresth S Juptimath',
    'Sponsorship Coordinator',
    null, null, null, null, null, null, null,
    'draft',
    'source_listed',
    'Listed on official NISB website (https://www.nisb.in/content.html#team). Verification status: source_listed.'
  ),
  (
    '22222222-2222-4222-a222-000000000013',
    'Priyanka Pramod Daivagna',
    'CS Chairperson',
    null, null, null, null, null, null, null,
    'draft',
    'source_listed',
    'Listed on official NISB website (https://www.nisb.in/content.html#team). Verification status: source_listed.'
  ),
  (
    '22222222-2222-4222-a222-000000000014',
    'Prerika P',
    'CS Secretary',
    null, null, null, null, null, null, null,
    'draft',
    'source_listed',
    'Listed on official NISB website (https://www.nisb.in/content.html#team). Verification status: source_listed.'
  ),
  (
    '22222222-2222-4222-a222-000000000015',
    'Nikitha H S',
    'CASS Chairperson & RAS Chairperson',
    null, null, null, null, null, null, null,
    'draft',
    'source_listed',
    'Listed on official NISB website (https://www.nisb.in/content.html#team). Verification status: source_listed.'
  ),
  (
    '22222222-2222-4222-a222-000000000016',
    'Suma Acharya',
    'CASS Secretary',
    null, null, null, null, null, null, null,
    'draft',
    'source_listed',
    'Listed on official NISB website (https://www.nisb.in/content.html#team). Verification status: source_listed.'
  ),
  (
    '22222222-2222-4222-a222-000000000017',
    'Sanjana S Shetty',
    'WIE Chairperson',
    null, null, null, null, null, null, null,
    'draft',
    'source_listed',
    'Listed on official NISB website (https://www.nisb.in/content.html#team). Verification status: source_listed.'
  ),
  (
    '22222222-2222-4222-a222-000000000018',
    'Panchami Urs S',
    'WIE Secretary',
    null, null, null, null, null, null, null,
    'draft',
    'source_listed',
    'Listed on official NISB website (https://www.nisb.in/content.html#team). Verification status: source_listed.'
  ),
  (
    '22222222-2222-4222-a222-000000000019',
    'Rachit Kulkarni',
    'RAS Secretary',
    null, null, null, null, null, null, null,
    'draft',
    'source_listed',
    'Listed on official NISB website (https://www.nisb.in/content.html#team). Verification status: source_listed.'
  ),
  (
    '22222222-2222-4222-a222-000000000020',
    'Mohammed Mansooruddin',
    'GRSS Chairperson',
    null, null, null, null, null, null, null,
    'draft',
    'source_listed',
    'Listed on official NISB website (https://www.nisb.in/content.html#team). Verification status: source_listed.'
  ),
  (
    '22222222-2222-4222-a222-000000000021',
    'Amol S',
    'GRSS Secretary',
    null, null, null, null, null, null, null,
    'draft',
    'source_listed',
    'Listed on official NISB website (https://www.nisb.in/content.html#team). Verification status: source_listed.'
  )
on conflict (id) do update set
  full_name = excluded.full_name,
  role = excluded.role,
  status = excluded.status,
  verification_status = excluded.verification_status,
  source_note = excluded.source_note;

commit;
