using System.Collections;
using UnityEngine;

public class UpDownMovement : MonoBehaviour
{

    public float moveSpeed = 2.0f;
    public float maxYOffset = 5.0f;
    public float topStopTime = 2.0f;
    public float bottomStopTime = 1.0f;


    private Vector3 initialPosition;
    private bool movingUp = true;

    private void Start()
    {
        initialPosition = transform.position;
        StartCoroutine(MoveUpDown());
    }

    private IEnumerator MoveUpDown()
    {
        while (true)
        {
            float targetY = movingUp ? initialPosition.y + maxYOffset : initialPosition.y;
            float stopTime = movingUp ? topStopTime : bottomStopTime;

            Vector3 targetPosition = new Vector3(transform.position.x, targetY, transform.position.z);

            float startTime = Time.time;
            float journeyLength = Mathf.Abs(targetY - transform.position.y);

            while (transform.position != targetPosition)
            {
                float distanceCovered = (Time.time - startTime) * moveSpeed;
                float fractionOfJourney = distanceCovered / journeyLength;
                transform.position = Vector3.Lerp(transform.position, targetPosition, fractionOfJourney);
                yield return null;
            }

            yield return new WaitForSeconds(stopTime);

            movingUp = !movingUp;
        }
    }
}
