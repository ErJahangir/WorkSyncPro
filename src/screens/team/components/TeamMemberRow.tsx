import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {useTheme} from '@/theme';
import type {Theme} from '@/theme';
import {Card, Avatar, Badge} from '@/components';
import {RNText} from '@/components/common';

interface TeamMemberRowProps {
  member: any;
  onPress: () => void;
}

export const TeamMemberRow: React.FC<TeamMemberRowProps> = ({
  member,
  onPress,
}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const {t} = useTranslation();

  return (
    <Card style={styles.card} onPress={onPress}>
      <View style={styles.memberRow}>
        <Avatar
          name={member.user?.name || '?'}
          uri={member.user?.avatar}
          size={48}
          showOnlineIndicator
          isOnline={Math.random() > 0.5}
        />
        <View style={styles.memberInfo}>
          <RNText style={styles.memberName}>
            {member.user?.name || t('memberProfile.defaultName')}
          </RNText>
          <RNText style={styles.memberEmail}>{member.user?.email || ''}</RNText>
        </View>
        <Badge
          label={t(`roles.${member.role}`)}
          variant={
            member.role === 'admin'
              ? 'error'
              : member.role === 'manager'
              ? 'warning'
              : 'neutral'
          }
          size="sm"
        />
      </View>
    </Card>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      marginBottom: 10,
    },
    memberRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    memberInfo: {
      flex: 1,
    },
    memberName: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.colors.text,
    },
    memberEmail: {
      fontSize: 12,
      marginTop: 1,
      color: theme.colors.textSecondary,
    },
  });
