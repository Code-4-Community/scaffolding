import { Table } from '@chakra-ui/react';

const COLUMNS = [
  'Name',
  'Start Date',
  'Experience Type',
  'Discipline',
  'Discipline Admin Name',
  'Status',
];

const APPLICATIONS = [
  {
    id: '1',
    name: 'Firstname Lastname',
    startDate: '01-01-2026',
    experienceType: 'Volunteer',
    discipline: 'Nursing',
    disciplineAdminName: 'Firstname Lastname',
    status: 'Approved',
  },
  {
    id: '2',
    name: 'Firstname Lastname',
    startDate: '01-01-2026',
    experienceType: 'Volunteer',
    discipline: 'Nursing',
    disciplineAdminName: 'Firstname Lastname',
    status: 'Approved',
  },
  {
    id: '3',
    name: 'Firstname Lastname',
    startDate: '01-01-2026',
    experienceType: 'Volunteer',
    discipline: 'Nursing',
    disciplineAdminName: 'Firstname Lastname',
    status: 'Approved',
  },
  {
    id: '4',
    name: 'Firstname Lastname',
    startDate: '01-01-2026',
    experienceType: 'Volunteer',
    discipline: 'Nursing',
    disciplineAdminName: 'Firstname Lastname',
    status: 'Approved',
  },
  {
    id: '5',
    name: 'Firstname Lastname',
    startDate: '01-01-2026',
    experienceType: 'Volunteer',
    discipline: 'Nursing',
    disciplineAdminName: 'Firstname Lastname',
    status: 'Approved',
  },
];

export const ApplicationTable: React.FC = () => {
  return (
    <Table.Root striped stickyHeader>
      <Table.Header>
        <Table.Row>
          {COLUMNS.map((column) => (
            <Table.ColumnHeader
              key={column}
              backgroundColor="#013594"
              color="white"
            >
              {column}
            </Table.ColumnHeader>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {APPLICATIONS.map((application) => (
          <Table.Row key={application.id}>
            <Table.Cell>{application.name}</Table.Cell>
            <Table.Cell>{application.startDate}</Table.Cell>
            <Table.Cell>{application.experienceType}</Table.Cell>
            <Table.Cell>{application.discipline}</Table.Cell>
            <Table.Cell>{application.disciplineAdminName}</Table.Cell>
            <Table.Cell>{application.status}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

export default ApplicationTable;
