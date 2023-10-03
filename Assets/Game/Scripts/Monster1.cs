using UnityEngine;

public class Monster1 : MonoBehaviour
{
    public float moveDistance = 5f; 
    public float speed = 5f; 
    public float delayAfterTeleport = 2f; 

    private Vector3 initialPosition;
    private float distanceMoved = 0f;
    private bool shouldMove = false;

    void Start()
    {
        initialPosition = transform.position;
        Invoke("StartMoving", delayAfterTeleport);
    }

    void Update()
    {
        if (shouldMove)
        {
            Vector3 newPosition = transform.position + Vector3.left * speed * Time.deltaTime;
            transform.position = newPosition;
            distanceMoved += Mathf.Abs(speed * Time.deltaTime);

            if (distanceMoved >= moveDistance)
            {
                transform.position = initialPosition;
                distanceMoved = 0f;
                shouldMove = false;
                Invoke("StartMoving", delayAfterTeleport);
            }
        }
    }

    void StartMoving()
    {
        shouldMove = true;
    }
}
